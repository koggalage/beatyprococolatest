import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Appointments, AppointmentFilterRequest, AppointmentStatusRequest } from './appointments.model';

@Injectable({
  providedIn: 'root'
})

export class AppointmentsService {

  private apiAppointmentUrl = 'appointments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getAppointmentList(request: AppointmentFilterRequest): Observable<Array<Appointments>> {
    let queryString = `departmentId=${request.departmentId}&&bookedDate=${request.bookedDate}&&status=${request.status}`;
    return this.baseDataService.makeGetCall(`${this.apiAppointmentUrl}${'/filter'}?${queryString}`);
  }

  public getAppointment(treatmentId: number): Observable<Appointments> {
    return this.baseDataService.makeGetCall(`${this.apiAppointmentUrl}/${treatmentId}`);
  }

  public addNewAppointment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}`, body);
  }


  public changeStatusOfAppointment(body: AppointmentStatusRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}/${'status'}`, body);
  }

  public editAppointment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}/${'edit'}`, body);
  }
  public deleteAppointment(cdid: string): Observable<Appointments> {
    let queryString = `cdid=${cdid}`;
    return this.baseDataService.makeDeleteCall(`${this.apiAppointmentUrl}?${queryString}`);
  }
}

