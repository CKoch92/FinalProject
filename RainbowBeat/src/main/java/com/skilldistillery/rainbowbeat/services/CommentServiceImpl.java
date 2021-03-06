package com.skilldistillery.rainbowbeat.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.rainbowbeat.entities.Comment;
import com.skilldistillery.rainbowbeat.repositories.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService{
	
	@Autowired
	private CommentRepository commentRepo;

	@Override
	public List<Comment> showAll() {
		return commentRepo.findAll();
	}

	@Override
	public Comment show(int id) {
		Optional<Comment> comment = commentRepo.findById(id);
		if (comment.isPresent()) {
			return comment.get();
		}
		return null;
	}
	
	@Override
	public List<Comment> getCommentsByUsername(String username){
		return commentRepo.findByUser_Username(username);
	}

	@Override
	public Comment create(Comment comment) {
		return commentRepo.saveAndFlush(comment);
	}

	@Override
	public Comment update(Comment comment) {
		return commentRepo.saveAndFlush(comment);
	}

	@Override
	public boolean delete(int id) {
		commentRepo.deleteById(id);
		return !commentRepo.existsById(id);
	}

}
