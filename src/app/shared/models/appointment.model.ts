export class NewAppointmentRequest {
    csId: number;
    customerId: string;
    bookedDate: Date;
    status: string;
    departmentId: number;
    branchId: number;
    treatments = new Array<AppointmentTreatment>();
}

export class AppointmentTreatment {
    ttid: number;
    empNo: number;
    startTime: string;
    endTime: string;
    qty: number;
}

export class Employees {
    empno: number;
    name: string;
}

export interface EmployeeFilterRequest {
    departmentId: number;
    date: Date;
}
