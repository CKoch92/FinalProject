package com.skilldistillery.rainbowbeat.services;

import java.util.List;

import com.skilldistillery.rainbowbeat.entities.Genre;
import com.skilldistillery.rainbowbeat.entities.Song;

public interface SongService{
	
	public List<Song> index();
	
	public Song show(String username, int songId);
	
	public Song create(Song song);
	
	public Song update(int songId, Song song);
	
	public boolean destroy(int songId);
	
	List<Song> getSongByKeyword(String keyword);
	
	List<Song> getSongByGenre(String genre);
}
