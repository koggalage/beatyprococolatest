import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
// import { AppointmentsService } from 'src/app/appointments/appointments.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SchedulerService } from '../scheduler.service';
import { SchedulerFilterRequest, ScheduleResponse } from '../scheduler.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/models/department.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/core/services/helper.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})

export class SchedulerListComponent implements OnInit {
  // public date = formatDate(new Date(), 'yyyy-mm-dd', '', '');
  public selectedDate;
  private minTime = 5;
  private openingHour = 8;
  public selectedDepartment;
  public scheduleResponseList: ScheduleResponse[];
  departments: Department[];
  timeInterval = [
    '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'
  ];
  private ngUnSubscription = new Subject();
  public hideTimeLine: boolean = false;
  date = moment();

  module: string;

  public user: any;

  public isSuperUser: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private data: DataService,
    public dialog: MatDialog,
    private schedulerService: SchedulerService,
    private helperService: HelperService,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.validateLoad();
    this.routeReload();
  }

  ngOnInit() {

    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Schedulers");

    this.validateLoad();

  }

  validateLoad() {

    this.selectedDate = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (this.isSuperUser) {
      if (!this.selectedDepartment) {
        this.toastr.error("Please Select a Department!");
      }
    } else {
      this.selectedDepartment = this.user.departmentId;
      this.loadSchedules();
    }

    this.hideTimeLine = (this.isSuperUser && !this.selectedDepartment);
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          //this.validateLoad();
          this.loadSchedules();
        }
      })
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadSchedules();
    }
  }

  onDateChange(e: any) {
    this.selectedDate = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadSchedules();
    }
  }

  loadSchedules() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.schedulerService
      .getFilteredScheduleList(this.generateScheduleFilterRequest())
      .subscribe((schedules: ScheduleResponse[]) => {
        this.scheduleResponseList = schedules;
        this.hideTimeLine = (!this.scheduleResponseList.length);
        console.log('this.scheduleResponseList', this.scheduleResponseList);
        this.generateTimeIndexes();
      });
  }

  private generateScheduleFilterRequest() {
    return <SchedulerFilterRequest>{
      departmentId: this.selectedDepartment,
      workingDate: this.selectedDate
    }
  }

  // loadSchedulers() {
  //   throw new Error("Method not implemented.");
  // }

  generateTimeIndexes() {
    let timeIndexLength = (this.timeInterval.length - 1) * (60 / this.minTime),
      //workingMin = (this.timeInterval.length - 1) * 60,
      openingHour = this.openingHour,
      minTimeSlot = this.minTime;

    this.scheduleResponseList.forEach(function (emp) {
      var timeIndexes = Array.apply(null, Array(timeIndexLength)).map(function () { return 'default' })

      if (emp.schedules) {

        emp.schedules.forEach(function (sched) {
          let startingIndex = ((((parseInt(sched.startTime.split(":")[0]) * 60) + parseInt(sched.startTime.split(":")[1])) - (openingHour * 60)) / minTimeSlot);
          let endIndex = ((((parseInt(sched.endTime.split(":")[0]) * 60) + parseInt(sched.endTime.split(":")[1])) - (openingHour * 60)) / minTimeSlot);
          sched.startIndex = startingIndex;
          sched.endIndex = endIndex;
          timeIndexes.fill('start', startingIndex, ++startingIndex);
          timeIndexes.fill('hasAppoinment', startingIndex, endIndex);
        });

      }

      emp.timeIndexes = timeIndexes;
    });
    console.log('this.scheduleResponseList', this.scheduleResponseList);
  }
}
