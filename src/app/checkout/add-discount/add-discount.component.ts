import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CheckoutService } from '../checkout.service';
import { DiscountRequest } from '../checkout.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit {
  public discountRequest = new DiscountRequest();
  public isSuperUser: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public checkoutService: CheckoutService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.isSuperUser = this.data.isAdmin;
  }
  submit() {
    let discount = this.discountRequest.discount;

    if (this.isSuperUser) {
      this.dialogRef.close({ discount: discount });
    } else {
      this.checkoutService
        .addDiscount(this.discountRequest)
        .subscribe((response: any) => {
          // this.products = products;
          this.dialogRef.close({ discount: discount });
          this.toastr.success("Discount added!");

          // this.newInvoiceableProduct.product = products[0];
        }, (error) => {
          this.dialogRef.close({ discount: 0.0 });
          this.toastr.error("Discount not added!");
        });
    }
  }

}
