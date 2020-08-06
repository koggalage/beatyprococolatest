import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClientsService } from '../clients/clients.service';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from './checkout.service';
import { SharedModule } from '../shared/shared.module';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { VouchersService } from '../vouchers/vouchers.service';


@NgModule({
  declarations: [CheckoutComponent, AddDiscountComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    AutocompleteLibModule,
    MatDialogModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    CheckoutService,
    ClientsService,
    VouchersService,
  ],
  entryComponents: [
    AddDiscountComponent
  ]
})
export class CheckoutModule { }
