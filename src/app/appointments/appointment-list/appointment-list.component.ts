import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Appointments, AppointmentFilterRequest, AppointmentStatusRequest } from '../appointments.model';
import { AppointmentsService } from '../appointments.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { NewAppointmentComponent } from 'src/app/core/new-appointment/new-appointment.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NewAppointmentComponent } from 'src/app/shared/new-appointments/new-appointments.component';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ToastrService } from 'ngx-toastr';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnSubscription = new Subject();
  module: string;
  appointmentList: Appointments[];
  departments: Department[];
  public selectedDepartment: number;
  appointmentStatus = ["pending", "confirmed", "cancelled"];

  public user: any;
  public isSuperUser: boolean = false;

  public date: string;
  public status: number;

  public selectedStatus = 4;

  constructor(
    private data: DataService,
    private appoinmentService: AppointmentsService,
    private route: Router,
    private departmentService: DepartmentService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private helperService: HelperService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    //this.routeReload();
  }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Appointments");

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date
    this.status = 4;

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.selectedDepartment = this.user.departmentId;
      this.loadAppointments();
    }

  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  onDateChange(e: any) {
    this.date = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');

    if (!this.selectedStatus) {
      this.toastr.error("Please select a status");
    } else {
      this.loadAppointments();
    }
  }

  onStatusChange(e: any) {
    console.log('eeeeee', e);
    this.selectedStatus = e.target.value;
    this.loadAppointments();
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadAppointments();
    }
  }

  loadAppointments() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }
    this.appoinmentService
      .getAppointmentList(this.createCustomerRequest())
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((appointments: Appointments[]) => {
        this.appointmentList = appointments;
      }, (error) => {
        this.toastr.error("Appointment List Loading Failed!");
      }
      );
  }

  createCustomerRequest() {
    return <AppointmentFilterRequest>{
      departmentId: this.selectedDepartment,
      bookedDate: this.date,
      status: this.selectedStatus
    };
  }

  addEditAppointment(appointment: Appointments) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(NewAppointmentComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['']);
          }
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }

  deleteAppointment(appointment) {
    if (appointment.status != 'confirmed') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = 'Do you want to delete ' + 'Appointment' + '?';
      // dialogConfig.width = "20%";
      this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
        (response) => {
          if (response.message) {
            this.appoinmentService.deleteAppointment(appointment.csid)
              .subscribe(
                (response) => {
                  console.log(response);
                  this.toastr.success('Deleted!');
                  this.route.navigate(['/home/appointments']);
                },
                (error) => {
                  this.toastr.error("Not Deleted!");
                  console.log(error);
                }
              );
            console.log(response);
          }
        }, (error) => {
          console.log(error);
        }
      );
    } else {
      this.toastr.warning("Confirmed appointments can not be deleted!");
    }
  }
}
