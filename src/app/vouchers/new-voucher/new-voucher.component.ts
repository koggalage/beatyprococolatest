import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { VouchersService } from '../vouchers.service';
import { ClientsService } from '../../clients/clients.service';
import { Customer, CustomerSearchRequest, Client } from 'src/app/clients/clients.model';
import { NewVoucherRequest, PaymentType } from '../vouchers.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Treatment, TreatmentFilterRequest } from 'src/app/treatments/treatments.model';
import { TreatmentService } from '../../treatments/treatment.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/models/department.model';

@Component({
  selector: 'app-new-voucher',
  templateUrl: './new-voucher.component.html',
  styleUrls: ['./new-voucher.component.scss']
})

export class NewVoucherComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public customers: Customer[]
  public paymentTypes: PaymentType[];
  public treatmentList: Treatment[];
  public departments: Department[];
  public newVoucherRequest = new NewVoucherRequest();
  public isPaymentTypeNotSelected: boolean = false;
  public keyword = 'fullName';
  public keywordTreatment = 'ttname';
  public editMode: boolean = false;

  public customerName: string;
  public treatment: string;

  public user: any;
  public isSuperUser: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewVoucherComponent>,
    private route: Router,
    private voucherService: VouchersService,
    private treatmentService: TreatmentService,
    public clientsService: ClientsService,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (!this.isSuperUser)
      this.newVoucherRequest.departmentId = this.user.departmentId;

    if (this.data != null) {
      this.editMode = true;
      this.newVoucherRequest = this.data;
      // this.newVoucherRequest.customerId="sdf34";
      this.customerName = this.data.customerName;
      this.treatment = this.data.treatment;
    }
    // console.log(this.data);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getCustomerList();
      this.getPaymentTypes();
      this.getTreatments();
      this.getDepartments();
    }, 0);
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }
  getDepartments() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }
  getPaymentTypes() {
    this.voucherService
      .getAllPaymentTypes()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((paymentTypes: PaymentType[]) => {
        this.paymentTypes = paymentTypes;
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
      departmentId: 0
    }
  }

  onPaymentTypeChange(e: any) {
    this.isPaymentTypeNotSelected = false;
    this.newVoucherRequest.ptid = e.target.value;

    if (this.newVoucherRequest.ptid == 1)
      this.newVoucherRequest.transType = null;
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
    this.newVoucherRequest.customerId = e.customerId;
  }

  selectTreatmentEvent(e: any) {
    this.newVoucherRequest.ttid = e.ttid;
    this.newVoucherRequest.dueAmount = e.price;
    this.newVoucherRequest.subTotalAmount = e.price;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    let work = "Added!";
    if (this.editMode) {
      work = "Updated!"
    }

    if (!this.newVoucherRequest.ptid) {
      this.isPaymentTypeNotSelected = true;
      return;
    }

    this.voucherService
      .addNewVoucher(this.newVoucherRequest)
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((result: any) => {
        // console.log(result);
        this.toastr.success("Voucher " + work);
      }, (error: any) => {
        this.toastr.error("Voucher Not " + work);
      }, () => {
        this.route.navigate(['home/vouchers']);
        this.dialogRef.close();
      })

  }

}
