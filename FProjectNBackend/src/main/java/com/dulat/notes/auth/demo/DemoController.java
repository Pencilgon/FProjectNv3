package com.dulat.notes.auth.demo;

import com.dulat.notes.user.Note;
import com.dulat.notes.user.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/demo-controller")
public class DemoController {

    private NoteRepository noteRepository;
    @Autowired
    public DemoController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint");
    }

    @GetMapping("/ok")
    public List<Note> allNotes(){
        return noteRepository.findByIsDeletedFalse();
    }

    @GetMapping("/find-by-id/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Integer id) {
        Optional<Note> note = noteRepository.findById(id);
        if (note.isPresent() && !note.get().isDeleted()) {
            return ResponseEntity.ok(note.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/create")
    public void addNote(@RequestBody Note note){
        noteRepository.save(note);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteNoteSoftly(@PathVariable Integer id){
        Optional<Note> note = noteRepository.findById(id);
        note.ifPresent(existingNote -> {
            existingNote.setDeleted(true);
            noteRepository.save(existingNote);
        });
    }

    @DeleteMapping("/delete-permanently/{id}")
    public void deleteNote(@PathVariable Integer id){
        noteRepository.deleteById(id);
    }
    @GetMapping("/recycle-bin")
    public List<Note> getDeletedNotes() {
        return noteRepository.findByIsDeletedTrue();
    }
    @PutMapping("/restore/{id}")
    public ResponseEntity<String> restoreNoteFromBin(@PathVariable Integer id){
        Optional<Note> note = noteRepository.findById(id);
        if (note.isPresent()) {
            Note existingNote = note.get();
            existingNote.setDeleted(false);
            noteRepository.save(existingNote);
            return ResponseEntity.ok("Note restored successfully.");
        }
        return ResponseEntity.notFound().build();
    }


    @PatchMapping("/update/{id}")
    public void updateNote(@PathVariable Integer id, @RequestBody Note note){
        Optional<Note> newNote = noteRepository.findById(id);
        if(newNote.isPresent()){
            Note existingNote = newNote.get();
            existingNote.setTitle(note.getTitle());
            existingNote.setContent(note.getContent());
            noteRepository.save(existingNote);
        }
    }
}
