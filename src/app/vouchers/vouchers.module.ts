import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VouchersService } from './vouchers.service';
import { NewVoucherComponent } from './new-voucher/new-voucher.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClientsService } from '../clients/clients.service';
import { FormsModule } from '@angular/forms';
import { TreatmentService } from '../treatments/treatment.service';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    VoucherListComponent,
    NewVoucherComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    VouchersRoutingModule,
    AutocompleteLibModule,
    FormsModule,
    SharedModule,    
    MatMomentDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  providers: [
    VouchersService,
    ClientsService,
    TreatmentService
  ],
  entryComponents: [
    NewVoucherComponent
  ]
})
export class VouchersModule { }
