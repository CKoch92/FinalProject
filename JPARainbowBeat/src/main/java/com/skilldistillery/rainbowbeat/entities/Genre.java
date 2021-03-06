package com.skilldistillery.rainbowbeat.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Genre {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(name="genre_name")
	private String name;
	@JsonIgnore
	@ManyToMany
	@JoinTable(name="song_genre",
	joinColumns=@JoinColumn(name="genre_id"),
	inverseJoinColumns=@JoinColumn(name="song_id"))
	private List<Song> songs;
	
	public Genre() {}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public List<Song> getSongs() {
		return songs;
	}
	public void setSongs(List<Song> songs) {
		this.songs = songs;
	}
	@Override
	public String toString() {
		return "Genre [id=" + id + ", name=" + name + ", songs=" + songs + "]";
	}

	

}
