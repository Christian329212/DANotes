import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() note!: Note;
  edit = false;
  hovered = false;

  constructor(private noteService: NoteListService) { }

  changeMarkedStatus() {
    this.note.marked = !this.note.marked;
    this.saveNote();

  }

  deleteHovered() {
    if (!this.edit) {
      this.hovered = false;
    }
  }

  openEdit() {
    this.edit = true;
  }

  closeEdit() {
    this.edit = false;
    this.saveNote();
  }

  moveToTrash() {
    if (this.note.id) {
      this.note.type = 'trash';
      let docId = this.note.id;
      delete this.note.id;
      this.noteService.addNote(this.note, "Trash"); // Add to trash in Firestore
      this.noteService.deleteNote("notes", docId); // Delete from notes in Firestore
    }
  }


  moveToNotes() {
    if (this.note.id) {
      this.note.type = 'note';
      let docId = this.note.id;
      delete this.note.id;
      this.noteService.addNote(this.note, "notes");
      this.noteService.deleteNote("Trash", docId);
    }
  }

  deleteNote() {
    if (this.note.id) {
      // Delete note from Firestore
      this.noteService.deleteNote("Trash", this.note.id)
        .then(() => {
          // Update local array
          this.noteService.trashNotes = this.noteService.trashNotes.filter(note => note.id !== this.note.id);
        })
        .catch(error => {
          console.error("Error deleting note from Firestore:", error);
        });
    }
  }


  saveNote() {
    this.noteService.updateNote(this.note);
  }

}
