import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentsRoutingModule } from './treatments-routing.module';
import { TreatmentListComponent } from './treatment-list/treatment-list.component';
import { NewTreatmentComponent } from './new-treatment/new-treatment.component';
import { TreatmentService } from './treatment.service';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    TreatmentListComponent,
    NewTreatmentComponent,
  ],
  imports: [
    CommonModule,
    TreatmentsRoutingModule,
    MatDialogModule,
    FormsModule,
    SharedModule,
    ColorPickerModule
  ],
  providers: [
    TreatmentService
  ],
  entryComponents: [
    NewTreatmentComponent
  ]
})
export class TreatmentsModule { }
