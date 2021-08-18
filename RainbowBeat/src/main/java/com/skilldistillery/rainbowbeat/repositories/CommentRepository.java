package com.skilldistillery.rainbowbeat.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skilldistillery.rainbowbeat.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer>{
	
}