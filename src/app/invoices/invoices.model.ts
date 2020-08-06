import { DateTime } from 'luxon';

export class Invoices {
  invoiceNo: string;
  customerFullName: string;
  invoiceDate: string;
  // invoiceDate: DateTime;
  tax: number;
  subTotal: number;
  discount: number;
  dueAmount: number;
  invoiceProducts: InvoiceProduct[];
  invoiceTreatments: InvoiceTreatment[];
}

export interface InvoiceProduct {
  cipid: number;
  invoiceNo: string;
  productId: string;
  productName: string;
  // productName: number;
  empno: number;
  recomendedBy: string;
  price: number;
  cost: number;
  qty: number;
}

export interface InvoiceTreatment {
  cipid: number;
  invoiceNo: string;
  treatmentTypeName: string;
  ttid: number;
  empno: number;
  employeeName: string;
  price: number;
  cost: number;
  qty: number;
  cstid: number;
}

export interface InvoiceFilterRequest {
  departmentId: number;
  date: string;
  status: number;
}

export class InvoiceViewResponse {
  treatmentSubTotal: number;
  productSubTotal: number;
  treatmentDiscountAmount: number;
  gvinvoiceNo: string;
  treatments: InvoiceViewTreatments[];
  products: InvoiceViewProducts[];
}

export interface InvoiceViewTreatments {
  treatmentName: string;
  quantity: number;
  amount: number;
}

export interface InvoiceViewProducts {
  productName: string;
  quantity: number;
  price: number;
}

