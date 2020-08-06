import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TreatmentService } from '../treatment.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NewTreatmentRequest } from '../treatments.model';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-treatment',
  templateUrl: './new-treatment.component.html',
  styleUrls: ['./new-treatment.component.scss']
})
export class NewTreatmentComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public departments: Department[];
  public newTreatmentRequest = new NewTreatmentRequest();
  public isDepartmentNotSelected: boolean = false;
  public isColorCodeNotSelected: boolean = false;
  public isEdit: boolean;

  public color: string;
  public hex: string;


  constructor(
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.newTreatmentRequest) {
      this.isEdit = true;
      this.newTreatmentRequest = this.data.newTreatmentRequest;
      // this.isDepartmentNotSelected = false;
      // this.isColorCodeNotSelected = false;
    } else {
      this.isEdit = false;
    }
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  onColorPickerChange(e: any) {
    this.isColorCodeNotSelected = false;
    this.newTreatmentRequest.colorCode = e;
  }

  onDepartmentChange(e: any) {
    this.isDepartmentNotSelected = false;
    this.newTreatmentRequest.departmentId = e.target.value;
    console.log(this.newTreatmentRequest.departmentId);
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    // let work = "Added!";
    // if (this.isEdit) {
    //   work = "Updated!"
    // }

    let work = (this.isEdit) ? "Updated!" : "Added!";

    if (!this.newTreatmentRequest.departmentId) {
      this.isDepartmentNotSelected = true;
      return;
    }

    if (this.newTreatmentRequest.colorCode == undefined ||
      this.newTreatmentRequest.colorCode == '#ffffff') {
      this.isColorCodeNotSelected = true;
      return;
    }

    this.treatmentService
      .addNewTreatment(this.newTreatmentRequest)
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((result: any) => {
        console.log(result);
        this.toastr.success("Treatment " + work);
        // this.route.navigate(['home/treatments']);
      }, (error: any) => {
        this.toastr.error("Treatment Not " + work);
      }, () => {

        // this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.route.navigate(['home/treatments']);
        this.dialogRef.close();
      })


  }

}
