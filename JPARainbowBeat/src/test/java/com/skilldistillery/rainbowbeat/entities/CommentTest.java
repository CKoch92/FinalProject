package com.skilldistillery.rainbowbeat.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CommentTest {
	
	private static EntityManagerFactory emf;
	private EntityManager em;
	private Comment comment;
	
	@BeforeAll
	static void setUpBeforeClass() throws Exception {
		emf = Persistence.createEntityManagerFactory("JPARainbowBeat");
	}

	@AfterAll
	static void tearDownAfterClass() throws Exception {
		emf.close();
	}

	@BeforeEach
	void setUp() throws Exception {
		em = emf.createEntityManager();
		comment = em.find(Comment.class, 1);
	}

	@AfterEach
	void tearDown() throws Exception {
		em.close();
		comment = null;
	}

	@Test
	@DisplayName("Comment Entity Test")
	void test1() {
		assertNotNull(comment);
		assertEquals("Ya Definitely A Sick Pony Song", comment.getContent());
	}
	
	@Test
	@DisplayName("Comment to Post Mapping Test")
	void test2() {
		assertNotNull(comment);
		assertNotNull(comment.getUser());
		assertEquals("Fresh Pony Song", comment.getPost().getTitle());
	}

}