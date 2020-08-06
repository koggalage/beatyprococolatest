import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-diolog-box',
  templateUrl: './diolog-box.component.html',
  styleUrls: ['./diolog-box.component.scss']
})
export class DiologBoxComponent implements OnInit {

  public cancelReason: string = '';
  public isShowCancelReason: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DiologBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.isShowCancelReason = (this.data == 'Are you sure you want to cancel this Invoice?');
  }

  closeDialog(value: boolean) {
    if (this.isShowCancelReason) {
      this.dialogRef.close({ message: value, reason: this.cancelReason });
    } else {
      this.dialogRef.close({ message: value });
    }

  }
}


