import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientsService } from './clients.service';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ClientRegistrationComponent,
    ClientListComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatDialogModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    ClientsService
  ],
  entryComponents: [
    ClientRegistrationComponent,
  ]
})
export class ClientsModule { }
