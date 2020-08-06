import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TreatmentService } from '../treatment.service';
import { Treatment, TreatmentFilterRequest, NewTreatmentRequest } from '../treatments.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from '../new-treatment/new-treatment.component';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/models/department.model';
import { ToastrService } from 'ngx-toastr';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.scss']
})
export class TreatmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  module: string;
  treatmentList: Treatment[];
  public selectedDepartment: number;
  private ngUnSubscription = new Subject();

  departments: Department[];

  public user: any;
  public isSuperUser: boolean = false;

  constructor(
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    private route: Router, private location: Location,
    public dialog: MatDialog,
    private data: DataService,
    private toastr: ToastrService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.routeReload();
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  ngOnInit() {

    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Treatments");

    this.validateLoad();
  }

  validateLoad() {
    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (this.isSuperUser) {
      if (!this.selectedDepartment) {
        this.toastr.error("Please Select a Department!");
      }
    } else {
      this.selectedDepartment = this.user.departmentId;
      this.loadTreatments();
    }
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          if (!this.selectedDepartment && this.isSuperUser) {
            this.toastr.error("Please Select a Department!");
          } else {
            this.validateLoad();
            //this.loadTreatments();
          }
        }
      })
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadTreatments();
    }
  }

  loadTreatments() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.treatmentService
      .getFilteredTreatmentList(this.generateTreatmentFilterRequest())
      .subscribe((treatments: Treatment[]) => {
        this.treatmentList = treatments;
      }, (error) => {
        this.toastr.error("Treatment List Loading Failed!");
      }
      );

    console.log(this.treatmentList)
  }

  private generateTreatmentFilterRequest() {
    return <TreatmentFilterRequest>{
      departmentId: this.selectedDepartment
    }
  }

  addEditTreatment(treatment: Treatment) {
    let newTreatmentRequest = new NewTreatmentRequest();
    if (treatment) {
      newTreatmentRequest.ttid = treatment.ttid;
      newTreatmentRequest.cost = treatment.cost;
      newTreatmentRequest.departmentId = treatment.departmentId;
      newTreatmentRequest.duration = treatment.duration;
      newTreatmentRequest.price = treatment.price;
      newTreatmentRequest.ttname = treatment.ttname;
    } else {
      newTreatmentRequest = null;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { newTreatmentRequest: newTreatmentRequest };
    this.dialog.open(NewTreatmentComponent, dialogConfig).afterClosed().subscribe(
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

  delete(treatment: Treatment) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to delete ' + treatment.ttname + '?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.treatmentService.deleteTreatment(treatment.ttid)
            .subscribe(
              (response) => {
                this.toastr.success('Deleted!');
                this.route.navigate(['']);
              },
              (error) => {
                this.toastr.error("Not Deleted!");
                console.log(error);
              }
            );
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

}
