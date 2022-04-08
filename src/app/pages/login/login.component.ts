import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../interfaces/user';
import { Toast } from 'src/app/enums/toasts.enum';
import { ToastService } from 'src/app/services/toast.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private toast: ToastService, private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = fb.group({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) this.router.navigateByUrl('/');

  }

  getErrorMessage(type) {
    const formControl = this.form.get(type);
    if (formControl.hasError('required')) return 'Required';
    if (formControl.hasError('validator')) return formControl.getError('validator');

  }

  login() {
    const user: UserLogin = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.signIn(user).subscribe((res) => {
      this.toast.show('Connected', 'Connection', Toast.Success);

    }, error => {
      this.toast.show(error.error.message, 'Connection', Toast.Error);

    });
  }

}
