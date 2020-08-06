import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { ClientsService } from '../clients.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClientRegistrationComponent } from '../client-registration/client-registration.component';
import { CustomerSearchRequest, Client, Customer } from '../clients.model';
import { fromEvent, Subject, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', null) searchInput: ElementRef;
  private ngUnSubscription = new Subject();

  public customers: Customer[];
  public searchText: string;
  module: string;

  constructor(
    private route: Router,
    private clientsService: ClientsService,
    public dialog: MatDialog,
    private data: DataService,
    private toastr: ToastrService
  ) {
    this.routeReload();
  }

  ngOnInit() {
    this.loadCustomers();
    this.searchCustomers();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Clients");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadCustomers();
        }
      })
  }

  searchCustomers() {

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.loadCustomers();
      });
  }

  loadCustomers() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest(this.searchInput.nativeElement.value))
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      }, (error) => {
        this.toastr.error("Client List Loading Failed!");
      }
      );
  }

  createCustomerRequest(searchText: string) {
    return <CustomerSearchRequest>{
      searchText: searchText
    };
  }

  addEditClient(customer: Customer) {
    let client = new Client();
    if (customer) {
      client.customerId = customer.customerId;
      client.name = customer.fullName;
      client.address = customer.address;
      client.contactNo = customer.mobileNo;
      client.email = customer.email;
      client.loyaltyCardNo = customer.loyaltyCardNo;
      client.gender = customer.gender;
      client.profession = customer.profession;
    } else {
      client = null;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { client: client };
    this.dialog.open(ClientRegistrationComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['/home/clients']);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }

  delete(client: Customer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to delete ' + client.fullName + '?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.clientsService.deleteClient(client.customerId)
            .subscribe(
              (response) => {
                this.toastr.success('Deleted!');
                this.route.navigate(['/home/clients']);
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
