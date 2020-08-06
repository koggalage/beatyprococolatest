import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentsService } from './appointments.service';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { NewAppointmentComponent } from '../shared/new-appointments/new-appointments.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    AppointmentListComponent,
    ViewAppointmentComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    AppointmentsRoutingModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    AppointmentsService
  ],
  entryComponents: [
    NewAppointmentComponent
  ]
})
export class AppointmentsModule { }
