import { Injectable } from '@angular/core';
import { BaseDataService } from 'src/app/core/services/base-data.service';
import { NewAppointmentRequest, EmployeeFilterRequest, Employees } from '../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiAppointmentUrl = 'appointments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public addNewAppointment(request: NewAppointmentRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}${'/save'}`, request);
  }

  // public getFilteredEmployees(request: EmployeeFilterRequest): Observable<Array<Employees>> {
  //   let queryString = `departmentId=${request.departmentId}&&date=${request.date}`;
  //   return this.baseDataService.makeGetCall(`${this.apiAppointmentUrl}${'/employees'}?${queryString}`);
  // }

  public getFilteredEmployees(request: EmployeeFilterRequest): Observable<Array<Employees>> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}${'/employees'}`, request);
  }

}
