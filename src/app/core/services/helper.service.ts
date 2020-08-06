import { Injectable } from '@angular/core';


var dateFormat = require('dateformat');

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  formatDate(date: any,format:string) {    
    return dateFormat(date, format);
  }

}
