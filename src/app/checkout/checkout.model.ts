
export class CheckoutTreatmentRequest {
  customerId: string;
  departmentId: number;
}

export class InvoiceSaveRequest {
  customerId: string;
  departmentId: number;
  treatments = new Array<InvoiceableTreatment>();
  products = new Array<InvoiceableProduct>();

  treatmentSubTotal: number;
  treatmentNetAmount: number;
  treatmentDueAmount: number;
  discount: number;
  treatmentDiscountAmount: number;
  treatmentsTax: number;
  treatmentsTaxAmount: number;

  productSubTotal: number;
  productDueAmount: number;
  productsTax: number;
  productsTaxAmount: number;
  ptid: number;
  transType: string;

  gvinvoiceNo: string;
  gVRedeemedAmount: number;

  
  
}

export class InvoiceableTreatment {
  treatmentName: string;
  amount: number;
  quantity: number;
  price: number;
  //discount: number;
  employeeNo: number;
  employeeName: string;
  customerScheduleTreatmentId: number;
  treatmentTypeId: number;
}

export class InvoiceableProduct {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  recomendedBy: number;
  recomendedByName: string;
  product: Products;
}

export class Products {
  itemId: string;
  itemName: string;
  description: string;
  isValid = false;
  sellingPrice: number;
  maxQty: number;
}


export class DiscountRequest {
  user: string;
  otp: string;
  discount: number;
}
