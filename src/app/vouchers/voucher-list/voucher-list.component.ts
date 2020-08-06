import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Vouchers, VoucherFilterRequest, ChangeVoucherStatusRequest } from '../vouchers.model';
import { VouchersService } from '../vouchers.service';
import { Location } from '@angular/common';
import { NewVoucherComponent } from '../new-voucher/new-voucher.component';
import { ToastrService } from 'ngx-toastr';
import { InputBoxComponent } from 'src/app/shared/components/input-box/input-box.component';
import { HelperService } from 'src/app/core/services/helper.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Department } from 'src/app/shared/models/department.model';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {

  public selectedStatus = 1;
  public changedStatus: number;
  public voucherList: Vouchers[];
  public date: string;

  public user: any;
  public isSuperUser: boolean = false;
  public selectedDepartment: number;
  private ngUnSubscription = new Subject();
  public departments: Department[];

  public status: number;

  //public module: string;

  public voucherStatusList = [
    "All", "Issued", "Redeemed", "Cancelled"
  ];

  public voucherEditStatusList = [
    "Issued", "Redeemed", "Cancelled"
  ];

  constructor(
    private data: DataService,
    private voucherService: VouchersService,
    private route: Router, private location: Location,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private helperService: HelperService,
    private departmentService: DepartmentService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.routeReload();
  }

  ngOnInit() {

    this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date

    //this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Vouchers");

    this.validateLoad();
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  validateLoad() {
    this.selectedStatus = 1;
    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (this.isSuperUser) {
      if (!this.selectedDepartment) {
        this.toastr.error("Please Select a Department!");
      }
    } else {
      this.selectedDepartment = this.user.departmentId;
      this.loadVouchers();
    }
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date
          this.validateLoad();
        }
      })
  }

  loadVouchers() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.voucherService
      .getFilteredVoucherList(this.generateVoucherFilterRequest())
      .subscribe((vouchers: Vouchers[]) => {
        this.voucherList = vouchers;
        this.voucherList.map(voucher => voucher.status = (voucher.isRedeem ? "Redeemed" : voucher.isCanceled ? "Cancelled" : "Issued"));
      }, (error) => {
        this.toastr.error("Voucher List Loading Failed!");
      });
  }

  private generateVoucherFilterRequest() {
    return <VoucherFilterRequest>{
      departmentId: this.selectedDepartment,
      status: this.selectedStatus,
      date: this.date
    }
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadVouchers();
    }
  }

  onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
    this.loadVouchers();
  }

  onStatusEdit(e: any, voucher: Vouchers) {
    this.changedStatus = e.target.value;

    this.voucherService
      .editVoucherStatus(this.generateStatusChangeRequest(voucher))
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((result: any) => {
        this.toastr.success("Voucher status edited!");
      }, (error: any) => {
        this.toastr.error("Voucher status not edited!");
      }, () => {
      })
  }

  generateStatusChangeRequest(voucher: Vouchers) {
    return <ChangeVoucherStatusRequest>{
      gvinvoiceNo: voucher.gvinvoiceNo,
      status: this.changedStatus
    }
  }

  addNewVoucher(voucher) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = voucher;

    this.dialog.open(NewVoucherComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['/home/vouchers']);
          }
        }
      }
    );
  }

  deleteVoucher(voucher: Vouchers) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to delete ' + voucher.gvinvoiceNo + ' ?\nPlease insert a reason';
    // dialogConfig.width = "20%";
    let id = voucher.gvinvoiceNo;
    this.dialog.open(InputBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.voucherService.deleteVoucher(id, response.reason)
            .subscribe(
              (response) => {
                console.log(response);
                this.toastr.success('Deleted!');
                this.route.navigate(['/home/vouchers']);
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
  }

  onDateChange(e: any) {
    this.date = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');

    if (!this.selectedStatus) {
      this.toastr.error("Please select a status");
    } else {
      this.loadVouchers();
    }
  }

}
