import { Component, OnInit } from '@angular/core';
import { Invoices, InvoiceFilterRequest } from '../invoices.model';
import { Subject } from 'rxjs';
import { Department } from 'src/app/shared/models/department.model';
import { InvoiceService } from '../invoice.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataService } from 'src/app/core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';
import { HelperService } from 'src/app/core/services/helper.service';
import { InvoiceViewResponse } from '../invoices.model';
import { PdfGenerateService } from 'src/app/core/services/pdf-generate.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})

export class InvoiceListComponent implements OnInit {
  module: string;
  invoiceList: Invoices[];
  public selectedDepartment: number;
  private ngUnSubscription = new Subject();
  departments: Department[];
  date: string;
  status: number;

  public user: any;
  public isSuperUser: boolean = false;
  public invoiceViewResponse = new InvoiceViewResponse();
  public selectedCustomer: any;

  constructor(
    private invoiceService: InvoiceService,
    private departmentService: DepartmentService,
    private route: Router,
    public dialog: MatDialog,
    private data: DataService,
    private toastr: ToastrService,
    private helperService: HelperService,
    private pdfGenerateServie: PdfGenerateService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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
    this.data.changeModule("Invoices");

    this.validateLoad();
  }

  validateLoad() {
    this.status = 4;
    this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (this.isSuperUser) {
      if (!this.selectedDepartment) {
        this.toastr.error("Please Select a Department!");
      }
    } else {
      this.selectedDepartment = this.user.departmentId;
      this.loadInvoices();
    }
  }


  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadInvoices();
    }
  }
  onDateChange(e) {
    this.date = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadInvoices();
    }
  }

  loadInvoices() {
    this.invoiceService
      .getFilteredInvoiceList(this.generateInvoiceFilterRequest())
      .subscribe((invoices: Invoices[]) => {
        this.invoiceList = invoices;
        this.invoiceList.forEach((inv) => { inv.invoiceDate = this.helperService.formatDate(inv.invoiceDate, 'yyyy/mm/dd') });
      }, (error) => {
        this.toastr.error("Invoice List Loading Failed!");
      }
      );

  }

  private generateInvoiceFilterRequest() {
    return <InvoiceFilterRequest>{
      departmentId: this.selectedDepartment,
      date: this.date,
      status: this.status
    }
  }

  viewInvoice(invoice: Invoices) {
    this.invoiceService
      .getInvoice(invoice.invoiceNo)
      .subscribe((invoices) => {
        this.invoiceViewResponse = invoices;



        var customerDetails = {
          fullName: invoice.customerFullName
        }
        console.log('invoice.customerFullName', this.invoiceViewResponse);
        this.pdfGenerateServie.getInvoicePdf(this.invoiceViewResponse, customerDetails);
      }, (error) => {
        this.toastr.error("Invoice Not Loaded!");
      }
      );
  }

  // viewInvoice(invoice: Invoices) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = { invoiceNo: invoice.invoiceNo };
  //   this.dialog.open(InvoiceViewComponent, dialogConfig).afterClosed().subscribe(
  //     (response) => {
  //       //console.log(response);
  //       if (!!response) {
  //         if (response.message == 'success') {
  //           this.route.navigate(['home/invoices']);
  //         }
  //       }
  //     }, (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  cancelInvoice(invoice: Invoices) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Are you sure you want to cancel this Invoice?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.invoiceService
            .cancelInvoice(invoice, response.reason)
            .subscribe((invoices: Invoices) => {
              this.toastr.success("Invoiced Cancelled", "Success");
            }, (error) => {
              this.toastr.error("Invoice cancel Failed!");
            });
        }
      }, (error) => {
        console.log(error);
      }
    );
  }
}

