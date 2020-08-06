import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherListComponent } from './voucher-list/voucher-list.component';


const routes: Routes = [
  {
    path: '',
    component: VoucherListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
