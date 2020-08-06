import { Injectable, ErrorHandler } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
    private toastr: ToastrService
  ) { }

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      this.toastr.error(error.message, error.statusText);
    } else {
      this.toastr.error(error.message, "Error");
    }

    console.error(error);

  }
}
