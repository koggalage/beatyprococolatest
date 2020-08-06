import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class InputBoxComponent implements OnInit {

  reason: string;

  constructor(
    public dialogRef: MatDialogRef<InputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
  }
  closeDialog(value: boolean) {
    if (value) {
      if (!!this.reason) {
        this.dialogRef.close({ message: value, resaon: this.reason });
      } else {
        this.toastr.warning("Please insert a reson");
      }
    } else {
      this.dialogRef.close({ message: value, resaon: null });
    }
  }

}
