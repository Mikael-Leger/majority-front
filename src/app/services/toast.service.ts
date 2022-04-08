import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Toast } from '../enums/toasts.enum';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) { }

  show(message: string, title: string, type: Toast){
    switch (type) {
      case Toast.Info:
        this.toastr.info(message, title, { timeOut: 2000, positionClass: 'toast-bottom-right' });
        break;
      case Toast.Success:
        this.toastr.success(message, title, { timeOut: 3000, positionClass: 'toast-bottom-right' });
        break;
      case Toast.Warning:
        this.toastr.warning(message, title, { timeOut: 4000, positionClass: 'toast-bottom-right' });
        break;
      case Toast.Error:
        this.toastr.error(message, title, { timeOut: 5000, positionClass: 'toast-bottom-right' });
        break;
      default:
        break;
    }
  }
}
