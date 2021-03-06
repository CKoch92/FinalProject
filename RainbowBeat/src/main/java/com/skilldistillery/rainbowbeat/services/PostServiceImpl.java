package com.skilldistillery.rainbowbeat.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.rainbowbeat.entities.Post;
import com.skilldistillery.rainbowbeat.repositories.PostRepository;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostRepository postRepo;
	
//	@Autowired 
//	private SongService songService;
	
	@Override
	public List<Post> allPosts() {
		return postRepo.findAll();
	}

	@Override
	public Post show(int id) {
		Optional<Post> p = postRepo.findById(id);
		Post post = null;
		if(p.isPresent()) {
			post = p.get();
		}
		return post;
	}

	@Override
	public List<Post> postsByKeyword(String keyword) {
		String containsKey = "%"+keyword+"%";
		List<Post> postsKeyword = postRepo.findByTitleLikeOrContentLikeOrUser_UsernameLikeOrSong_TitleLikeOrSong_ArtistLikeOrSong_AlbumLikeOrSong_Genres_NameLike(containsKey, containsKey, containsKey, containsKey, containsKey, containsKey, containsKey);
		System.out.println("********************************************************");
		System.out.println(postsKeyword);
		return postsKeyword;
	}

	@Override
	public List<Post> postsByGenre(String genre) {
		return postRepo.findBySong_Genres_Name(genre);
	}

	@Override
	public Post create(Post post) {
		Post p = null;
		try {
			p = postRepo.saveAndFlush(post);
		} catch (Exception e) {		}
		return p;
	}

	@Override
	public Post update(int postId, Post post) {
//		Post p = null;
		post.setId(postId);
//		p = postRepo.saveAndFlush(post);
//		System.out.println("**********************************8");
//		System.out.println(p);
		return postRepo.saveAndFlush(post);
	}
	
	@Override
	public List<Post> postsByUser(String username){
		return postRepo.findByUser_Username(username);
		
	}

	@Override
	public boolean destroy(int id) {
		System.out.println("************************************");
		System.out.println(id);
		Post post = null;
		if(postRepo.findById(id).isPresent()) {
			post = postRepo.findById(id).get();
			System.out.println(post);
		}
		postRepo.deleteById(id);
		boolean postDelete = !postRepo.existsById(id);
		System.out.println("************************************");
		System.out.println("Post Deleted: " + postDelete);
		return postDelete;
	}

}
