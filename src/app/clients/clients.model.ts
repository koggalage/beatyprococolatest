export interface Customer {
  customerId: string;
  fullName: string;
  mobileNo: string;
  address: string;
  email: string;
  gender: string;
  profession: string;
  loyaltyCardNo: string;
}

export interface CustomerSearchRequest {
  searchText: string;
  departmentId: number;
}

export class Client {
  customerId: string;
  name: string;
  address: string;
  contactNo: string;
  email: string;
  gender: string;
  loyaltyCardNo: string;
  profession: string;
}
