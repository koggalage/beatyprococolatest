import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Treatment, TreatmentFilterRequest, NewTreatmentRequest } from './treatments.model';

@Injectable()
export class TreatmentService {

  private apiTreatmentUrl = 'treatments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getFilteredTreatmentList(request: TreatmentFilterRequest): Observable<Array<Treatment>> {
    let queryString = `departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}${'/filter'}?${queryString}`);
  }

  public getTreatmentList(): Observable<Array<Treatment>> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Treatment> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}/${treatmentId}`);
  }

  public addNewTreatment(body: NewTreatmentRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}/${'save'}`, body);
  }

  public editTreatment(body: Treatment): Observable<Treatment> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}/${'edit'}`, body);
  }

  public deleteTreatment(treatmentTypeId: number): Observable<any> {
    let queryString = `treatmentTypeId=${treatmentTypeId}`;
    return this.baseDataService.makeDeleteCall(`${this.apiTreatmentUrl}?${queryString}`);
  }
}
