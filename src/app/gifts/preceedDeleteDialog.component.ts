import {Component} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'proceedDeleteDialog',
  templateUrl: 'dialog.html'
})
export class ProceedDeleteDialog {
  constructor (public dialogRef: MdDialogRef<ProceedDeleteDialog>){}

    onYesClick() : void {
      this.dialogRef.close(true);
    }

    onNoClick(): void {
    this.dialogRef.close(false);
  }
}
