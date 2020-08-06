import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private moduleSource = new BehaviorSubject('');
  currentModule = this.moduleSource.asObservable();

  private customerIdSource = new BehaviorSubject('');
  scheduledCustomerId = this.customerIdSource.asObservable();

  private customerNameSource = new BehaviorSubject('');
  scheduledCustomerName = this.customerNameSource.asObservable();

  private departmentIdSource = new BehaviorSubject('');
  scheduledDepartmentId = this.departmentIdSource.asObservable();

  constructor() { }

  changeModule(module: string) {
    this.moduleSource.next(module);
  }

  changeCustomerId(id: string) {
    this.customerIdSource.next(id);
  }

  changeCustomerName(id: string) {
    this.customerNameSource.next(id);
  }

  changeDepartmentId(id: string) {
    this.departmentIdSource.next(id);
  }

}
