import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { CheckoutTreatmentRequest, InvoiceableTreatment, Products, InvoiceableProduct, InvoiceSaveRequest } from '../checkout.model';
import { ClientsService } from 'src/app/clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CheckoutService } from '../checkout.service';
import { Employees, EmployeeFilterRequest } from 'src/app/shared/models/appointment.model';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { PaymentType, Vouchers, VoucherFilterRequest, IssuedVoucherFilterRequest } from 'src/app/vouchers/vouchers.model';
import { VouchersService } from 'src/app/vouchers/vouchers.service';
import { PdfGenerateService } from 'src/app/core/services/pdf-generate.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private ngUnSubscription = new Subject();

  public user: any;
  public isSuperUser: boolean = false;
  public selectedCustomer: Customer;
  public selectedVoucher: Vouchers;

  module: string;
  customerId: string;
  customerName: string;
  departmentId: number;

  public customers: Customer[];
  public invoiceableTreatment = new Array<InvoiceableTreatment>();
  public invoiceableProduct = new Array<InvoiceableProduct>();
  public keyword = 'fullName';
  public checkoutTreatmentRequest = new CheckoutTreatmentRequest();
  public isEmployeeNotSelected: boolean = true;
  public isCustomerNotSelected: boolean = true;
  public employeesList: Employees[];
  public keywordEmployee = 'name';

  public products: Products[];
  isNotValidQty: boolean = true;
  isProductNotSelected: boolean = true;
  isProductNotDuplicated: boolean = true;
  public keywordProduct = 'itemName';
  public keywordVoucher = 'voucherNo';

  public invoiceSaveRequest = new InvoiceSaveRequest();
  public newInvoiceableProduct = new InvoiceableProduct();


  public treatmentSubTotal = 0;
  public treatmentNetAmount = 0;
  public treatmentDueAmount = 0;
  public discount = 0;
  public treatmentsDiscountAmount = 0;
  public treatmentsTax = 0.06;
  public treatmentsTaxAmount = 0;


  public productSubTotal = 0;
  public productDueAmount = 0;
  public productsTax = 0.06;
  public productsTaxAmount = 0;

  public productName;
  public therapistName;

  departments: Department[];
  selectedDepartment;
  // public selectedDate;
  public paymentTypes: PaymentType[];
  public voucherList: Vouchers[];
  public gVRedeemedAmount: number;
  public voucherDueAmount: number;

  isPaymentTypeNotSelected: boolean = true;
  isCardPayment: boolean = false;
  selectedCustomerfullName = '';

  constructor(
    public clientsService: ClientsService,
    public checkoutService: CheckoutService,
    private data: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    // private helperService: HelperService,
    private route: Router,
    private voucherService: VouchersService,
    private pdfGenerateServie: PdfGenerateService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");

    this.data.scheduledCustomerId.subscribe(id => this.customerId = id);
    this.data.scheduledCustomerName.subscribe(name => this.customerName = name);
    this.data.scheduledDepartmentId.subscribe(id => this.departmentId = parseInt(id));

    console.log(this.customerId + " " + this.departmentId + " " + this.customerName);

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    setTimeout(() => {
      this.getProductList();
      this.getEmployees();
      this.getPaymentTypes();
    }, 0);

    this.initializeRidirectedFromScheduler();
    this.validateUserRole();
    this.getAllDepartments();
  }

  initializeRidirectedFromScheduler() {
    if (this.departmentId && this.customerId && this.customerName) {
      this.selectedDepartment = this.departmentId;
      this.getCustomerList('');

      this.checkoutTreatmentRequest.customerId = this.customerId;
      this.checkoutTreatmentRequest.departmentId = this.selectedDepartment;
      this.invoiceSaveRequest.customerId = this.customerId;
      this.invoiceSaveRequest.departmentId = this.selectedDepartment;
      this.getInvoiceTreatmentList();
      this.loadVouchers();
    }

  }

  validateUserRole() {
    // this.selectedDate = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    if (this.isSuperUser) {
      if (!this.selectedDepartment) {
        this.toastr.error("Please Select a Department!");
      }
    } else if (!this.selectedDepartment) {
      this.selectedDepartment = this.user.departmentId;
      //this.loadVouchers();
      this.getCustomerList('');
    } else if (this.selectedDepartment != this.user.departmentId) {
      this.toastr.error("Unauthorized action! Page realoding!");
      this.route.navigate(['/home/checkout']);
    }

  }

  getPaymentTypes() {
    this.voucherService
      .getAllPaymentTypes()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((paymentTypes: PaymentType[]) => {
        this.paymentTypes = paymentTypes;
      });
  }

  addProduct(isFormValid: boolean) {
    if (!this.isCustomerNotSelected) {
      if (isFormValid && this.validateAddProduct()) {
        if (this.checkProductExist()) {
          this.invoiceableProduct.push(this.newInvoiceableProduct);
          this.calculateProduct();
          this.newInvoiceableProduct = new InvoiceableProduct();
          this.therapistName = null;
          this.productName = null;
        } else {
          this.toastr.warning("Product is already in list");
        }
      } else {
        this.toastr.warning("Please fill required field");
      }
    } else {
      this.validateAddProduct();
      this.toastr.warning("Select a customer available for invoicing!");
    }
  }

  checkProductExist() {
    var i = this.invoiceableProduct.findIndex(
      product => product.productId == this.newInvoiceableProduct.productId
    );

    if (i != -1)
      return false
    return true;
  }

  validateAddProduct(): boolean {
    let isValid = true;

    if (!this.newInvoiceableProduct.quantity) {
      this.isNotValidQty = true;
      isValid = false;
    } else {
      if (this.newInvoiceableProduct.quantity <= 0) {
        isValid = false;
        this.isNotValidQty = true;

      } else {
        this.isNotValidQty = false;
      }
    }

    if (!this.newInvoiceableProduct.recomendedBy) {
      this.isEmployeeNotSelected = true;
      isValid = false;
    } else {
      this.isEmployeeNotSelected = false;
    }



    return isValid;

  }

  calculate() {
    this.treatmentSubTotal = this.invoiceableTreatment.reduce(
      (acc, ele) => acc + (ele.price * ele.quantity), 0
    );

    this.treatmentsDiscountAmount = this.treatmentSubTotal * (this.discount / 100.00);
    this.treatmentNetAmount = (this.treatmentSubTotal - this.treatmentsDiscountAmount);
    this.treatmentsTaxAmount = (this.treatmentNetAmount * this.treatmentsTax);
    this.treatmentDueAmount = (this.treatmentNetAmount + this.treatmentsTaxAmount);
  }

  calculateProduct() {
    this.productSubTotal = this.invoiceableProduct.reduce(
      (acc, ele) => acc + (ele.price * ele.quantity), 0
    );

    this.productsTaxAmount = (this.productSubTotal * this.productsTax);
    this.productDueAmount = (this.productSubTotal + this.productsTaxAmount);
  }

  removeProduct(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to remove ' + this.invoiceableProduct[index].productName + '?';
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.products.push(this.invoiceableProduct[index].product);
          this.invoiceableProduct.splice(index, 1);
          this.toastr.success('Removed!');
          this.calculateProduct();
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  loadVouchers() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.voucherService
      .getIssuedVoucherList(this.generateVoucherFilterRequest())
      .subscribe((vouchers: Vouchers[]) => {
        this.voucherList = vouchers;
        this.voucherList.map(voucher => voucher.status = (voucher.isRedeem ? "Redeemed" : voucher.isCanceled ? "Cancelled" : "Issued"));
      }, (error) => {
        this.voucherList = null;
        this.toastr.error("Voucher List Loading Failed!");
      });
  }

  private generateVoucherFilterRequest() {
    return <IssuedVoucherFilterRequest>{
      customerId: this.invoiceSaveRequest.customerId
    }
  }

  getCustomerList(search: string) {
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.clientsService
      .getScheduleCustomerList(this.createCustomerRequest(search))
      .subscribe((customers: Customer[]) => {
        this.customers = customers;
        if (this.customerId) {
          for (let index = 0; index < this.customers.length; index++) {
            if (this.customers[index].customerId == this.customerId) {
              this.selectedCustomer = this.customers[index];
              this.selectedCustomerfullName = this.selectedCustomer.fullName;
            }
          }

          if (!this.selectedCustomer) {
            this.toastr.error("Available Customer not found!");
          }
        }

      }, (error) => {
        this.toastr.error("Client List Loading Failed!");
      });
  }

  getProductList() {
    this.checkoutService
      .getProductList()
      .subscribe((products: Products[]) => {
        this.products = products;
        // this.newInvoiceableProduct.product = products[0];
      }, (error) => {
        this.toastr.error("Product List Loading Failed!");
      });
  }

  createCustomerRequest(search: string) {
    return <CustomerSearchRequest>{
      searchText: search,
      departmentId: this.selectedDepartment
    };
  }

  selectCustomerEvent(e: any) {
    this.data.changeCustomerId(null);
    // this.data.changeDepartmentId(null);
    this.data.changeCustomerName(null);

    this.checkoutTreatmentRequest.customerId = e.customerId;
    this.checkoutTreatmentRequest.departmentId = this.selectedDepartment;
    this.invoiceSaveRequest.customerId = e.customerId;
    this.invoiceSaveRequest.departmentId = this.selectedDepartment;
    this.getInvoiceTreatmentList();
    this.loadVouchers();
  }

  clearCustomerEvent(e: any) {
    if (this.customerId && this.customerName) {
      // this.toastr.info("Wait! Customer List is Loading!");
      this.data.changeCustomerId(null);
      // this.data.changeDepartmentId(null);
      this.data.changeCustomerName(null);
      this.selectedCustomer = null;
      this.selectedCustomerfullName = '';
      this.getCustomerList('');
    }
  }

  selectVoucherEvent(e: any) {
    console.log('eeeee', e);
    this.invoiceSaveRequest.gvinvoiceNo = e.gvinvoiceNo;
    this.voucherDueAmount = e.dueAmount;
  }

  saveInvoice() {
    if (!this.selectedDepartment) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    if (!this.selectedCustomer && this.invoiceableTreatment.length < 1) {
      this.toastr.error("Please Select a Customer!");
      return;
    }

    if (this.isPaymentTypeNotSelected) {
      this.toastr.error("Please Select Payment Type!");
      return;
    }

    if (this.invoiceSaveRequest.ptid != 1 && !this.invoiceSaveRequest.transType) {
      this.toastr.error("Please Select a Transaction Type!");
      return;
    }

    this.invoiceSaveRequest.products = this.invoiceableProduct;
    this.invoiceSaveRequest.treatments = this.invoiceableTreatment;

    this.invoiceSaveRequest.discount = this.discount;
    this.invoiceSaveRequest.treatmentDiscountAmount = this.treatmentsDiscountAmount;
    this.invoiceSaveRequest.treatmentDueAmount = this.treatmentDueAmount;
    this.invoiceSaveRequest.treatmentNetAmount = this.treatmentNetAmount;
    this.invoiceSaveRequest.treatmentSubTotal = this.treatmentSubTotal;
    this.invoiceSaveRequest.treatmentsTax = this.treatmentsTax;
    this.invoiceSaveRequest.treatmentsTaxAmount = this.treatmentsTaxAmount;

    this.invoiceSaveRequest.productDueAmount = this.productDueAmount;
    this.invoiceSaveRequest.productSubTotal = this.productSubTotal;
    this.invoiceSaveRequest.productSubTotal = this.productSubTotal;
    this.invoiceSaveRequest.productsTax = this.productsTax;
    this.invoiceSaveRequest.productsTaxAmount = this.productsTaxAmount;
    this.invoiceSaveRequest.gVRedeemedAmount = this.gVRedeemedAmount;

    this.checkoutService
      .saveInvoice(this.invoiceSaveRequest)
      .subscribe((response: any) => {
        this.invoiceSaveRequest.gvinvoiceNo = response;
        this.route.navigate(['home/checkout']);
        this.toastr.success("Invoice Saved!");
        if (this.customerName) {
          this.selectedCustomer.fullName = this.customerName;
        }
        this.pdfGenerateServie.getInvoicePdf(this.invoiceSaveRequest, this.selectedCustomer);
      }, (error) => {
        this.toastr.error("Invoice Failed!");
      });
  }

  getInvoiceTreatmentList() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.checkoutService
      .getInvoiceTreatmentList(this.checkoutTreatmentRequest)
      .subscribe((treatments: InvoiceableTreatment[]) => {
        this.invoiceableTreatment = treatments;
        this.isCustomerNotSelected = false;
        this.calculate();
      }, (error) => {
        this.invoiceableTreatment = null;
        this.toastr.error("Treatment List Loading Failed!");
      });
  }


  getEmployees() {
    this.appointmentService
      .getFilteredEmployees(this.generateEmployeeFilterRequest())
      .subscribe((employees: Employees[]) => {
        this.employeesList = employees;
      }, (error) => {
        this.toastr.error("Therapist List Loading Failed!");
      });
  }

  private generateEmployeeFilterRequest() {

    return <EmployeeFilterRequest>{
      departmentId: 1,
      date: new Date()
    }
  }


  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  onQtyChange(event: any) {
    if (this.newInvoiceableProduct.quantity) {

    }

  }

  selectEmployeeEvent(e: any) {
    this.isEmployeeNotSelected = false;
    this.newInvoiceableProduct.recomendedBy = e.empno;
    this.newInvoiceableProduct.recomendedByName = e.name;

  }

  selectProductEvent(e: any) {
    this.isProductNotSelected = false;
    this.newInvoiceableProduct.productId = e.itemId;
    this.newInvoiceableProduct.productName = e.itemName;
    this.newInvoiceableProduct.price = e.sellingPrice;
  }


  addDiscount() {
    if (!this.isCustomerNotSelected) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { isAdmin: this.isSuperUser };

      // dialogConfig.data = Object.assign([], this.products);
      this.dialog.open(AddDiscountComponent, dialogConfig).afterClosed().subscribe(
        (response) => {
          if (response.discount) {
            console.log(response.discount);

            this.discount = response.discount;
            this.calculate();
            console.log(this.discount);

          }
          // console.log(response);
        }, (error) => {
          console.log(error);
        }
      );

    } else {
      this.toastr.warning("Select a customer available for invoicing!");
    }
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;

    this.data.changeCustomerId(null);
    this.data.changeDepartmentId(null);
    this.data.changeCustomerName(null);
    this.selectedCustomerfullName = '';

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      //this.loadVouchers();
      this.getCustomerList('');
      this.isCustomerNotSelected = true;
      this.invoiceableTreatment = new Array<InvoiceableTreatment>();
      this.invoiceableProduct = new Array<InvoiceableProduct>();
      this.selectedCustomer = null;
      this.treatmentSubTotal = 0;
      this.treatmentNetAmount = 0;
      this.treatmentDueAmount = 0;
      this.discount = 0;
      this.treatmentsDiscountAmount = 0;
      this.treatmentsTax = 0.06;
      this.treatmentsTaxAmount = 0;


      this.productSubTotal = 0;
      this.productDueAmount = 0;
      this.productsTax = 0.06;
      this.productsTaxAmount = 0;

      this.voucherList = null;
    }
  }

  onPaymentTypeChange(e: any) {
    console.log('e pt', e);
    this.invoiceSaveRequest.ptid = e.target.value;
    this.isPaymentTypeNotSelected = false;
    this.isCardPayment = (e.target.value == 2);

    if (!this.isCardPayment) {
      this.invoiceSaveRequest.transType = null;
    }

    // if (this.invoiceSaveRequest.ptid == 1) {
    //   this.invoiceSaveRequest.transType = null;
    //   this.isPaymentTypeNotSelected = false;
    // }
  }

  getAllDepartments() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }


  ngOnDestroy() {
    this.data.changeCustomerId(null);
    this.data.changeDepartmentId(null);
    this.data.changeCustomerName(null);
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }
}
