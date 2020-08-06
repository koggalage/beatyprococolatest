import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Customer, CustomerSearchRequest, Client } from './clients.model';

@Injectable()
export class ClientsService {
  private apiClientsUrl = 'customers';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getCustomerList(request: CustomerSearchRequest): Observable<Array<Customer>> {
    let queryString = `searchText=${request.searchText}`;
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}${'/search'}?${queryString}`);
  }

  public getScheduleCustomerList(request: CustomerSearchRequest): Observable<Array<Customer>> {
    let queryString = `searchText=${request.searchText}&&departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}${'/search-confirmed-schedule-customer'}?${queryString}`);
  }

  public getTreatment(treatmentId: number): Observable<Customer> {
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}/${treatmentId}`);
  }

  public addNewCustomer(body: Client): Observable<Customer> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}`, body);
  }

  public editTreatment(body: Client): Observable<Customer> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}/${'edit'}`, body);
  }

  public deleteClient(customerId: string): Observable<Customer> {
    let queryString = `customerId=${customerId}`;
    return this.baseDataService.makeDeleteCall(`${this.apiClientsUrl}?${queryString}`);
  }
}

