import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Vouchers, VoucherFilterRequest, NewVoucherRequest, PaymentType, VouchersDeleteRequest, ChangeVoucherStatusRequest, IssuedVoucherFilterRequest } from './vouchers.model';


@Injectable()
export class VouchersService {

  private apiVoucherUrl = 'vouchers';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getFilteredVoucherList(request: VoucherFilterRequest): Observable<Array<Vouchers>> {
    let queryString = `status=${request.status}
                      &&date=${request.date}
                      &&departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiVoucherUrl}${'/filter'}?${queryString}`);
  }

  public getIssuedVoucherList(request: IssuedVoucherFilterRequest): Observable<Array<Vouchers>> {
    let queryString = `customerId=${request.customerId}`;
    return this.baseDataService.makeGetCall(`${this.apiVoucherUrl}${'/issued-vouchers'}?${queryString}`);
  }

  public addNewVoucher(body: NewVoucherRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiVoucherUrl}/${'save'}`, body);
  }

  public getAllPaymentTypes(): Observable<Array<PaymentType>> {
    return this.baseDataService.makeGetCall(`${this.apiVoucherUrl}/${'paymentTypes'}`)
  }

  public getVoucherList(): Observable<Array<Vouchers>> {
    return this.baseDataService.makeGetCall(`${this.apiVoucherUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Vouchers> {
    return this.baseDataService.makeGetCall(`${this.apiVoucherUrl}/${treatmentId}`);
  }

  public editTreatment(body: Vouchers): Observable<Vouchers> {
    return this.baseDataService.makePostCall(`${this.apiVoucherUrl}/${'edit'}`, body);
  }

  public editVoucherStatus(body: ChangeVoucherStatusRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiVoucherUrl}/${'edit-voucher-status'}`, body);
  }

  public deleteVoucher(request: string, reason: string): Observable<any> {
    let vou = new VouchersDeleteRequest();
    vou.gvinvoiceNo = request;
    vou.cancelReason = reason;
    let queryString = `request=${vou}`;
    return this.baseDataService.makeDeleteCall(`${this.apiVoucherUrl}?${queryString}`);
  }

}
