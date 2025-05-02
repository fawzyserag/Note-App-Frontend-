import { NgStyle } from '@angular/common';
import Swal from 'sweetalert2';
import {
  Component,
  inject,
  model,
  signal,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { NotesService } from '../../core/services/notes.service';
import { NoteData } from '../../core/interfaces/note-data';
import { title } from 'process';
import { SearchPipe } from '../../core/pipes/search.pipe';
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NgStyle, SideNavComponent,SearchPipe,FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent implements OnInit {
  ngOnInit(): void {
    this.notesService.getUserNotes().subscribe({
      next: (res) => {
        console.log(res);
        this.allNotes = res.notes;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  private readonly notesService = inject(NotesService);
  allNotes: NoteData[] = [];
  searchInput:string=''
  openDialog(noteData?: NoteData): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '350px',
      width: '500px',
      data: {
        title: noteData?.title,
        content: noteData?.content,
        _id: noteData?._id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
      this.ngOnInit();
    });
  }

  deleteNotes(deletedNote: string, noteIndex: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        }).then(() => {
          this.notesService.handleDeleteNote(deletedNote).subscribe({
            next: (res) => {
              console.log(res);
              this.allNotes.splice(noteIndex, 1);
              this.ngOnInit();
            },
            error: (error) => {
              console.error(error);
            },
          });
        });
      }
    });
  }

  updateData(noteData: NoteData, noteIndex: number) {
    this.openDialog({
      title: noteData.title,
      content: noteData.content,
      _id: noteData._id,
    });
  }
}
