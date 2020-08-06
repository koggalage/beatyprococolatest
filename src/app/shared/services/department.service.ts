
import { Injectable } from '@angular/core';
import { BaseDataService } from 'src/app/core/services/base-data.service';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiTreatmentUrl = 'treatments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getAllDepartments(): Observable<Array<Department>> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}/${'departments'}`);
  }
}

