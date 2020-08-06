import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatInputModule } from '@angular/material';
import { NewAppointmentComponent } from './new-appointments/new-appointments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TreatmentService } from '../treatments/treatment.service';
import { ClientsService } from '../clients/clients.service';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DiologBoxComponent } from './components/diolog-box/diolog-box.component';
import { InputBoxComponent } from './components/input-box/input-box.component';

@NgModule({
  declarations: [NewAppointmentComponent, DiologBoxComponent, InputBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutocompleteLibModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    MaterialTimePickerModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  exports: [
    NewAppointmentComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    DiologBoxComponent
  ],
  providers: [
    TreatmentService,
    ClientsService
  ],
  entryComponents: [DiologBoxComponent, InputBoxComponent]
})
export class SharedModule { }
