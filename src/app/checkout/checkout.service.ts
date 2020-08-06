import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { CheckoutTreatmentRequest, InvoiceableTreatment, Products, InvoiceSaveRequest, DiscountRequest } from './checkout.model';
import { Observable } from 'rxjs';

@Injectable()
export class CheckoutService {

  private apiInvoiceUrl = 'invoice';
  private apiProductUrl = 'products';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getInvoiceTreatmentList(request: CheckoutTreatmentRequest): Observable<Array<InvoiceableTreatment>> {
    let queryString = `customerId=${request.customerId}&&departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}${'/treatments'}?${queryString}`);
  }

  public getProductList(): Observable<Array<Products>> {
    return this.baseDataService.makeGetCall(`${this.apiProductUrl}`);
  }

  saveInvoice(invoiceSaveRequest: InvoiceSaveRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiInvoiceUrl}${'/save'}`, invoiceSaveRequest);
  }

  addDiscount(discountRequest: DiscountRequest) {
    return this.baseDataService.makePostCall(`${this.apiInvoiceUrl}${'/invoice-discount'}`, discountRequest);
  }

}
