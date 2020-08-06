import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Client } from '../clients.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent implements OnInit {

  public client = new Client();
  public isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<ClientRegistrationComponent>,
    private route: Router,
    private clientService: ClientsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.client) {
      this.client = this.data.client;
      this.isEdit = true;
    } else {
      this.client.gender = "M";
      this.isEdit = false;

    }
  }

  onGenderChange(event: any) {
    this.client.gender = event.target.value;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    let work = "Added!";
    if (this.isEdit) {
      work = "Updated!"
    }

    this.clientService
      .addNewCustomer(this.client)
      .subscribe((result: any) => {
        this.toastr.success("Client " + work);
      }, (error: any) => {
        this.toastr.error("Client Not " + work);
      }, () => {
        this.dialogRef.close();
        this.route.navigate(['home/clients']);
      });
  }

}
