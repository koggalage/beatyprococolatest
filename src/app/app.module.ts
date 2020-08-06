import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from './core/core.module';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';
// import { MaterialModule } from './material.module';
// import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatFormFieldModule, MatDatepickerModule, MatInputModule } from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import * as moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { NewAppointmentComponent } from './shared/new-appointments/new-appointments.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    //NewAppointmentComponent
  ],
  imports: [
    BrowserModule,
    AutocompleteLibModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatInputModule,
    TooltipModule,
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    MaterialTimePickerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      newestOnTop: true
    }
    ),
    AppRoutingModule,
    HttpClientModule,
    // MaterialModule,
    CoreModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    // { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'moment', useValue: moment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
