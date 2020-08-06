import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.scss']
})
export class ViewAppointmentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewAppointmentComponent>,
  ) { }

  ngOnInit() {
  }

}
