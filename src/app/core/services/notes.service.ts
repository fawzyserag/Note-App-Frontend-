import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NoteData } from '../interfaces/note-data';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly httpClient = inject(HttpClient);
  constructor() {}

  handleAddNotes(newNote: NoteData): Observable<any> {
    return this.httpClient.post(environment.notesUrl + 'notes', newNote, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  getUserNotes(): Observable<any> {
    return this.httpClient.get(environment.notesUrl + 'notes', {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  handleDeleteNote(noteId: string): Observable<any> {
    return this.httpClient.delete(environment.notesUrl + 'notes/' + noteId, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  handleUpdate(noteDate: NoteData, noteId: string): Observable<any> {
    return this.httpClient.put(
      environment.notesUrl + 'notes/' + noteId,
      noteDate,
      {
        headers: {
          token: localStorage.getItem('token') || '',
        },
      }
    );
  }
}
