// export class Appointments {
//   id: number;
//   client: string;
//   treatment: string;
//   date: string;
//   time: string;
//   duration: string;
//   therapist: string;
//   price: number;
// }

// export class AppointmentFilterRequest {
//   departmentId: number;
// }

export class Appointments {
  csId: number;
  customerId: string;
  bookedDate: string;
  departmentId: number;
  branchId: number;
  treatments: AppointmentTreatment;
  therapist: string;
  price: number;
  status: string;
  client: string;
  treatment: string;
  date: string;
  time: string;
  duration: string;
}

// csId":2,"client":"Dinesh ","treatment":"test1treatment","date":"2019 - 11 - 18T00: 00: 00","time":"08: 30: 00","duration":"01: 30: 00","therapist":"Nayani","price":134.00,"departmentId":1}

export class AppointmentFilterRequest {
  departmentId: number;
  bookedDate: string;
  status: number;
}

export class AppointmentStatusRequest {
  csId: number;
  status: string;
}

export class AppointmentTreatment {
  ttid: number;
  empNo: string;
  startTime: string;
  endTime: string;
  qty: number;
}

