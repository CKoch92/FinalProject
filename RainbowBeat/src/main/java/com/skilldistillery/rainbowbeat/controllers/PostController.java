package com.skilldistillery.rainbowbeat.controllers;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skilldistillery.rainbowbeat.entities.Post;
import com.skilldistillery.rainbowbeat.repositories.PostRepository;
import com.skilldistillery.rainbowbeat.services.PostService;

@RestController
@RequestMapping("api")
@CrossOrigin({"*", "http://localhost:4291"})
public class PostController {
	
	@Autowired
	private PostService postService;
	
	@Autowired
	private PostRepository postRepo;
	
	
	@GetMapping("posts")
	public List<Post> getAllPosts(HttpServletRequest req, HttpServletResponse res){
		List<Post> posts = postService.allPosts();
		if(posts == null) {
			res.setStatus(404);
		}
		return posts;
	}
	
	@GetMapping("posts/{id}")
	public Post getPostById(HttpServletRequest req, HttpServletResponse res, @PathVariable int id) {
		Post post = postService.show(id);
		if (post == null) {
			res.setStatus(404);
		}
		return post;
	}
	
	@GetMapping("posts/user/{username}")
	public List<Post> getPostsByUsername(HttpServletRequest req, HttpServletResponse res, @PathVariable String username){
		List<Post> posts = postService.postsByUser(username);
		if(posts == null) {
			res.setStatus(404);
		}
		return posts;
	}
	
	@GetMapping("posts/search/{keyword}")
	public List<Post> getPostsByKeyword(HttpServletRequest req, HttpServletResponse res, @PathVariable String keyword){
		List<Post> posts = postService.postsByKeyword(keyword);
		if (posts == null) {
			res.setStatus(404);
		}
		return posts;
	}
	
	@GetMapping("posts/genre/{genre}")
	public List<Post> getPostsByGenre(HttpServletRequest req, HttpServletResponse res, @PathVariable String genre){
		List<Post> posts = postService.postsByGenre(genre);
		if (posts == null) {
			res.setStatus(404);
		}
		return posts;
	}
	
	@PostMapping("posts")
	public Post createPost(HttpServletRequest req, HttpServletResponse res, @RequestBody Post post) {
		Post p = postService.create(post);
		try {
			if(p == null) {
				res.setStatus(404);
			}else {
				res.setStatus(201);
				StringBuffer url = req.getRequestURL();
				url.append("/").append(p.getId());
				res.setHeader("Location", url.toString());
			}
		} catch (Exception e) {
			res.setStatus(400);
			p=null;
		}
		return p;
	}
	
	@PutMapping("posts/{postId}")
	public Post updatePost(HttpServletRequest req, HttpServletResponse res, @PathVariable int postId, @RequestBody Post post, Principal principal) {
		Post p = new Post();
		System.out.println("******************************");
		System.out.println(post);
		System.out.println(postId);
		try {
			p = postService.update(postId, post);
			System.out.println("******************************");
			System.out.println(p);
			res.setStatus(200);
			if (p == null) {
				res.setStatus(404);
			}
		} catch (Exception e) {
			System.out.println("******************************");
			System.out.println(e);
			res.setStatus(400);
			p = null;
		}
		return p;
	}
	
	@DeleteMapping("posts/{id}")
	public void deletePost(HttpServletRequest req, HttpServletResponse res, @PathVariable int id) {
		System.out.println("*****************************");
		System.out.println(id);
		Post post = null;
		if(postRepo.findById(id).isPresent()) {
			post = postRepo.findById(id).get();
			System.out.println(post);
		}		
		boolean deleted = postService.destroy(id);
		if(deleted) {
			res.setStatus(204);
		}else {
			res.setStatus(404);
		}
	}

}
