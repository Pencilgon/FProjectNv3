package com.dulat.notes.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findByIsDeletedTrue();
    List<Note> findByIsDeletedFalse();
}
