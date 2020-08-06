export class Treatment {
  ttid: number;
  ttname: string;
  department: string;
  departmentId: number;
  duration: number;
  cost: number;
  price: number;
}

export interface TreatmentFilterRequest {
  departmentId: number;
}

export class NewTreatmentRequest {
  ttid: number;
  ttname: string;
  price: number;
  cost: number;
  duration: number;
  departmentId: number;
  colorCode: string;
}
