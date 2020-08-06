import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppointmentService } from '../services/appointment.service';
import { Router } from '@angular/router';
import { NewAppointmentRequest, Employees, EmployeeFilterRequest, AppointmentTreatment } from '../models/appointment.model';
import { Client, CustomerSearchRequest, Customer } from 'src/app/clients/clients.model';
import { TreatmentService } from 'src/app/treatments/treatment.service';
import { ClientsService } from 'src/app/clients/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Treatment, TreatmentFilterRequest } from 'src/app/treatments/treatments.model';
import * as moment from 'moment';
import { Department } from '../models/department.model';
import { DepartmentService } from '../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-appointments',
  templateUrl: './new-appointments.component.html',
  styleUrls: ['./new-appointments.component.scss']
})
export class NewAppointmentComponent implements OnInit {
  @ViewChild('auto', { static: false }) auto;
  @ViewChild('autoTreatment', { static: false }) autoTreatment;

  private ngUnSubscription = new Subject();

  public customers: Customer[];
  public departments: Department[];
  public treatmentList: Treatment[];
  public employeesList: Employees[];

  public keyword = 'fullName';
  public keywordTreatment = 'ttname';
  public keywordEmployee = 'name';

  //public isDepartmentNotSelected: boolean = false;
  public isTreatmentNotSelected: boolean = false;
  public isCustomerNotSelected: boolean = false;
  public isEmployeeNotSelected: boolean = false;
  //public isDateNotSelected: boolean = false;
  public isStartTimeNotSelected: boolean = false;
  public isStartTimeInvalid: boolean = false;
  public isEndTimeInvalid: boolean = false;
  public isTimeInvalid: boolean = false;
  public isSuperUser: boolean = false;
  public isEdit: boolean = false;

  private ttid: number;
  private empNo: number;
  private treatmentDuration: number;
  public treatmentQty: number = 1;
  private startTimespan: string;
  private endTimespan: string;

  //minDate = new Date(moment().format('YYYY, MM, DD'));
  //initdate = moment(this.data.selectedDate);
  initdate = moment(this.data.selectedDate).format("MM-DD-YYYY");

  public exportTime = { hour: 0, minute: 0, meriden: 'AM', format: 12 };
  public exportEndTime = { hour: 0, minute: 0, meriden: 'AM', format: 12 };

  public startHour: string;
  public startMin: string;
  public endHour: number;
  public endMin: number;

  public user: any;

  public appointmentStatus = ["Pending", "Confirmed", "Cancelled"];

  public initialValueCustomer: string = '';
  public initialValueTreatment: string = '';
  public initialValueEmployee: string = '';

  public selectedStatus: string;
  private openingHour = 8;
  private minTimeSlot = 5;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    private appointmentService: AppointmentService,
    private route: Router,
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    public clientsService: ClientsService,
    private toastr: ToastrService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  public newAppointmentRequest = new NewAppointmentRequest();

  ngOnInit() {
    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");
    if (this.isSuperUser) {
      this.newAppointmentRequest.departmentId = this.data.selectedDepartment;
    } else {
      this.newAppointmentRequest.departmentId = this.user.departmentId;
    }

    this.getTreatments();

    if (this.data.isEdit) {
      this.initialValueCustomer = this.data.selectedSchedule.clientName;
      this.initialValueTreatment = this.data.selectedSchedule.treatmentType;
      this.initialValueEmployee = this.data.scheduleResponse.employeeName;
      this.treatmentQty = this.data.selectedSchedule.quantity;

      this.startTimespan = this.data.selectedSchedule.startTime;
      this.endTimespan = this.data.selectedSchedule.endTime;

      console.log('this.endTimespan', this.endTimespan);

      this.exportTime = { hour: parseInt(this.startTimespan.split(":")[0]), minute: parseInt(this.startTimespan.split(":")[1]), meriden: (parseInt(this.startTimespan.split(":")[0]) >= 12) ? 'PM' : 'AM', format: 12 };
      this.exportEndTime = { hour: parseInt(this.endTimespan.split(":")[0]), minute: parseInt(this.endTimespan.split(":")[1]), meriden: (parseInt(this.endTimespan.split(":")[0]) >= 12) ? 'PM' : 'AM', format: 12 };

      //this.newAppointmentRequest.csId = this.data.selectedSchedule.customerScheduleId;
      this.newAppointmentRequest.customerId = this.data.selectedSchedule.customerId;
      this.ttid = this.data.selectedSchedule.ttId;
      this.empNo = this.data.scheduleResponse.empNo;
      this.selectedStatus = this.data.selectedSchedule.scheduleStatus;

      this.treatmentDuration = this.data.selectedSchedule.treatmentDuration;
      console.log('this.data.selectedSchedule.treatmentDuration', this.data.selectedSchedule.treatmentDuration);
      this.getEmployees();
    }

  }

  ngAfterViewInit() {
    this.setStartTime();
    this.getCustomerList();
    this.getDepartments();
  }

  onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
  }

  setStartTime() {
    let totalMinutesByIndex = this.data.selectedIndex * 5;
    let hoursByIndex = Math.trunc(totalMinutesByIndex / 60);
    let minutesByIndex = (totalMinutesByIndex - (hoursByIndex * 60));
    let meriden = 'AM';
    let seconds = 0;

    hoursByIndex += 8;

    this.startTimespan = this.getTimeSpan(hoursByIndex, minutesByIndex, seconds);

    if (hoursByIndex >= 12) {
      if (hoursByIndex != 12) {
        hoursByIndex -= 12;
      }

      meriden = 'PM';
    }

    //this.startTimespan = this.getTimeSpan(hoursByIndex, minutesByIndex, seconds);
    this.exportTime = { hour: hoursByIndex, minute: minutesByIndex, meriden: meriden, format: 12 };
  }

  getCustomerList() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest())
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      });
  }

  createCustomerRequest() {
    return <CustomerSearchRequest>{
      searchText: ''
    };
  }

  selectCustomerEvent(e: any) {

    if (this.data.isEdit && e == this.data.selectedSchedule.clientName) {
      this.newAppointmentRequest.customerId = this.data.selectedSchedule.customerId;
    } else {
      this.newAppointmentRequest.customerId = e.customerId;
    }

    this.isCustomerNotSelected = false;
  }

  getDepartments() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  getTreatments() {
    this.treatmentService
      .getFilteredTreatmentList(this.generateTreatmentFilterRequest())
      .subscribe((treatments: Treatment[]) => {
        this.treatmentList = treatments;
      });
  }

  private generateTreatmentFilterRequest() {
    return <TreatmentFilterRequest>{
      departmentId: this.newAppointmentRequest.departmentId
    }
  }

  selectTreatmentEvent(e: any) {
    this.isTreatmentNotSelected = false;


    if (this.data.isEdit && e == this.data.selectedSchedule.treatmentType) {
      this.treatmentDuration = this.data.selectedSchedule.treatmentDuration;
      this.ttid = this.data.selectedSchedule.ttId;
    } else {
      this.treatmentDuration = e.duration;
      this.ttid = e.ttid;
    }

    if (this.startTimespan) {
      this.setEndTime(this.startTimespan.split(":")[0], this.startTimespan.split(":")[1]);
    }
  }

  getEmployees() {
    this.appointmentService
      .getFilteredEmployees(this.generateEmployeeFilterRequest())
      .subscribe((employees: Employees[]) => {
        this.employeesList = employees;
      });
  }

  private generateEmployeeFilterRequest() {
    return <EmployeeFilterRequest>{
      departmentId: this.newAppointmentRequest.departmentId,
      date: this.data.selectedDate
    }
  }

  // onEmployeeSelect(e: any) {
  //   console.log('emp e', e);
  //   console.log('employeeName e', this.data.scheduleResponse.employeeName);

  //   if (this.data.isEdit && e == this.data.scheduleResponse.employeeName) {
  //     this.empNo = this.data.scheduleResponse.empNo;
  //   } else {
  //     this.empNo = e.empno;
  //   }


  //   this.isEmployeeNotSelected = false;
  // }

  onChangeHour(e: any) {
    let startHour = (parseInt(e.hour)),
      meriden = e.meriden,
      minutes = parseInt(e.minute);
    console.log(meriden, "meriden");
    // this.isStartTimeInvalid = (parseInt(e.hour) < 8);
    // if (meriden == 'PM') {
    //   startHour -= 12;
    // }
    this.isStartTimeInvalid = ((isNaN(startHour)) || ((startHour >= 10) && (startHour < 12) && (minutes > 0) && (meriden == 'PM')) || (((startHour == 12) || ((startHour >= 1) && (startHour < 8))) && (minutes > 0) && (meriden == 'AM')));
    console.log(this.isStartTimeInvalid, "this.isStartTimeInvalid");

    if (meriden == 'PM') {
      startHour += 12;
    }

    this.isStartTimeNotSelected = false;

    this.setEndTime(startHour.toString(), e.minute);

    //this.isStartTimeInvalid = (parseInt(e.hour) < 8);

    //sthis.validateSave();
  }

  setEndTime(hour: string, minute: string) {

    this.startHour = hour;
    this.startMin = minute;

    let tDuration = this.treatmentDuration;

    if (this.treatmentQty > 0) {
      tDuration *= this.treatmentQty;
    }

    let totalMinutes = ((parseInt(hour) * 60) + parseInt(minute)) + tDuration;
    let meriden = 'AM';
    let hours = Math.floor(totalMinutes / 60);
    let seconds = 0;
    let minutes = ((totalMinutes - (hours * 60)) % 60);

    this.endHour = hours;
    this.endMin = minutes;
    this.startTimespan = this.getTimeSpan(parseInt(hour), parseInt(minute), seconds);
    this.endTimespan = this.getTimeSpan(hours, minutes, seconds);

    if (hours >= 12) {
      if (hours != 12) {
        hours -= 12;
      }

      meriden = 'PM';
    }

    //this.isEndTimeInvalid = ((isNaN(hours)) || ((hours >= 12) && (minutes > 0)));
    this.isEndTimeInvalid = ((isNaN(hours)) || ((hours >= 10) && (hours < 12) && (minutes > 0) && (meriden == 'PM')) || ((hours == 12) && (hours >= 1) && (hours < 8) && (minutes > 0) && (meriden == 'AM')));

    this.exportEndTime = { hour: hours, minute: minutes, meriden: meriden, format: 12 };


    this.getTimeValidity();
  }

  getTimeSpan(hours: number, minutes: number, seconds: number) {
    return hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
  }

  save() {
    if (!this.newAppointmentRequest.customerId) {
      this.isCustomerNotSelected = true;
      return;
    }

    if (!this.ttid) {
      this.isTreatmentNotSelected = true;
      return;
    }

    if (!this.data.scheduleResponse.empNo) {
      this.isEmployeeNotSelected = true;
      return;
    }

    if (!this.startTimespan) {
      this.isStartTimeNotSelected = true;
      return;
    }

    if (this.isStartTimeInvalid) {
      return;
    }

    if (this.isEndTimeInvalid) {
      return;
    }

    if (this.isTimeInvalid) {
      return;
    }

    this.newAppointmentRequest.treatments.push(<AppointmentTreatment>{
      ttid: this.ttid,
      empNo: this.data.scheduleResponse.empNo,
      startTime: this.startTimespan,
      endTime: this.endTimespan,
      qty: this.treatmentQty
    });

    this.appointmentService
      .addNewAppointment(this.generateAppointmentRequest())
      .subscribe((result: any) => {
        console.log(result);
      }, (error: any) => {
        console.log('result error', error);
      }, () => {
        this.route.navigate(['home/scheduler']);
        this.dialogRef.close();
      });
  }
  cancel() {
    this.dialogRef.close();
  }

  private generateAppointmentRequest(): NewAppointmentRequest {
    return <NewAppointmentRequest>{
      customerId: this.newAppointmentRequest.customerId,
      bookedDate: this.data.selectedDate,
      departmentId: this.newAppointmentRequest.departmentId,
      treatments: this.newAppointmentRequest.treatments,
      csId: this.data.isEdit ? this.data.selectedSchedule.customerScheduleId : 0,
      status: this.data.isEdit ? this.selectedStatus : 'Pending'
    };
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  onQtyChange(event: any) {
    this.treatmentQty = Number(event.target.value);

    if (this.startTimespan) {
      this.setEndTime(this.startTimespan.split(":")[0], this.startTimespan.split(":")[1]);
    }

  }

  getTimeValidity() {
    // let appoinmentStartTimeMin = ((parseInt(this.startHour) * 60) + (parseInt(this.startMin)));
    // let appoinmentEndTimeMin = ((this.endHour * 60) + this.endMin);

    let isNotValidTime = false,
      customerSchedulStart = (this.data.selectedSchedule != undefined) ? this.data.selectedSchedule.startIndex : -1,
      // customerScheduleId = (this.data.selectedSchedule != undefined) ? this.data.selectedSchedule.customerScheduleId : 0,
      customerScheduleEnd = (this.data.selectedSchedule != undefined) ? this.data.selectedSchedule.endIndex : -1,
      startingIndex = ((((parseInt(this.startHour) * 60) + parseInt(this.startMin)) - (this.openingHour * 60)) / this.minTimeSlot),
      endIndex = ((((this.endHour * 60) + this.endMin) - (this.openingHour * 60)) / this.minTimeSlot);

    // for (let index = startingIndex; index < endIndex; index++) {
    //   if (!isNotValidTime && !((customerSchedulStart != -1) &&
    //     (index >= customerSchedulStart && index < customerScheduleEnd))) {
    //     isNotValidTime = this.data.scheduleResponse.timeIndexes[index] != 'default';
    //   }
    // }

    if (!(this.isStartTimeInvalid || this.isEndTimeInvalid)) {
      for (let index = startingIndex; index < endIndex; index++) {
        if (!isNotValidTime && !((customerSchedulStart != -1) &&
          (index >= customerSchedulStart && index < customerScheduleEnd))) {
          isNotValidTime = this.data.scheduleResponse.timeIndexes[index] != 'default';
        }
      }
    }

    this.isTimeInvalid = isNotValidTime;


    // this.data.scheduleResponse.schedules.forEach(function (sched: any) {

    //   if (!isNotValidTime && !((customerScheduleId != 0) &&
    //     (sched.customerScheduleId == customerScheduleId))) {

    //     let schedStartTimeMin = (parseInt(sched.startTime.split(":")[0]) * 60) + (parseInt(sched.startTime.split(":")[1]));
    //     let schedEndTimeMinu = (parseInt(sched.endTime.split(":")[0]) * 60) + (parseInt(sched.startTime.split(":")[1]));

    //     // isNotValidTIme = !(((treamentStartTimeMin < 1 ) && (treamentEndTimeMin < schedStartTimeMin))
    //     //   || ((treamentStartTimeMin > schedEndTimeMinu) && (treamentEndTimeMin > schedEndTimeMinu)));

    //     isNotValidTime = !(((appoinmentStartTimeMin < schedStartTimeMin) && (appoinmentEndTimeMin < schedStartTimeMin))
    //       || ((appoinmentStartTimeMin > schedEndTimeMinu) && (appoinmentEndTimeMin > schedEndTimeMinu)));

    //     //On Edit
    //     // isNotValidTime = ((customerScheduleId != 0) &&
    //     //   (sched.customerScheduleId == customerScheduleId)) ? false : isNotValidTime;

    //   }

    // });
    // }

    // this.isTimeInvalid = isNotValidTime;
  }


}
