import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceService } from './invoice.service';
import { MatDialogModule, MatDatepickerModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [InvoiceListComponent, InvoiceViewComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule
  ],
  providers: [
    InvoiceService
  ],
  entryComponents:[InvoiceViewComponent]
})
export class InvoicesModule { }
