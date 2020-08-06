export class Vouchers {
  gvinvoiceNo: string;
  customerName: string;
  enteredBy: string;
  enteredDate: Date;
  isRedeem: boolean;
  isCanceled: boolean;
  dueAmount: number;
  status: string;
  treatment: string;
}

export interface VoucherFilterRequest {
  departmentId: number;
  status: number;
  date: string;
}

export interface IssuedVoucherFilterRequest {
  departmentId: number;
  customerId: string;
}

export class NewVoucherRequest {
  customerId: string;
  voucherNo: string;
  dueAmount: number;
  ptid: number;
  ttid: number;
  departmentId: number;
  transType: string;
  subTotalAmount: number;
}

export interface PaymentType {
  ptid: number;
  ptname: string;
}

export class VouchersDeleteRequest {
  cancelReason: string;
  gvinvoiceNo: string;
}

export class ChangeVoucherStatusRequest {
  gvinvoiceNo: string;
  status: number;
}

