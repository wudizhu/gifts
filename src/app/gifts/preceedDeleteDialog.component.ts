import {Component} from '@angular/core';
import {MdDialog} from '@angular/material';


/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'proceedDelete',
  template: '<button md-button (click)="openDialog()">Open dialog</button>'
})
export class ProceedDelete {
  constructor(public dialog: MdDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(ProceedDeleteDialog, {
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'proceedDeleteDialog',
  template: '<button md-button (click)="openDialog()">Open dialog</button>'
})
export class ProceedDeleteDialog {

  openDialog() {}
}

