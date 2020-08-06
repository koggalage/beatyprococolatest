export interface SchedulerFilterRequest {
  departmentId: number;
  workingDate: Date;
}

export class ScheduleResponse {
  employeeName: string;
  designation: string;
  schedules = new Array<Schedules>();
  timeIndexes: Array<string>;
}

export class Schedules {
  clientName: string;
  scheduleStatus: string;
  treatmentType: string;
  startTime: string;
  endTime: string;
  startIndex: number;
  endIndex: number;
  customerId: string;
  departmentId: number;
  ttId: number;
  // timeIndexes: Array<string>;
}
