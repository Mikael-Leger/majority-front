import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UserRegister, UserLogin } from '../../interfaces/user';
import { EmailValidator, ConfirmedValidator } from '../../validators/register.validator';
import { ToastService } from '../../services/toast.service';
import { Toast } from 'src/app/enums/toasts.enum';
import { LengthValidator } from 'src/app/validators/length.validator';
import { TypeValidator } from 'src/app/enums/type-validators.enum';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  private formObjects = [
    {
      label: 'Username',
      name: 'username'
    },
    {
      label: 'Email',
      name: 'email'
    },
    {
      label: 'Password',
      name: 'password'
    },
    {
      label: 'Confirm Password',
      name: 'confirmPassword'
    }
  ];

  constructor(private toast: ToastService, private authService: AuthService, private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: [
        LengthValidator('username', TypeValidator.Username),
        LengthValidator('password', TypeValidator.Password),
        EmailValidator('email'),
        ConfirmedValidator('password', 'confirmPassword')
      ]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) this.router.navigateByUrl('/');
  }

  getErrorMessage(type: string): string {
    const formControl = this.form.get(type);
    if (formControl.hasError('required')) return 'Required';
    if (formControl.hasError('validator')) return formControl.getError('validator');

  }

  register() {
    let errors = false;
    this.formObjects.forEach(formObject => {
      const formObjectErrors = this.form.get(formObject.name).errors;
      if (formObjectErrors) {
        if (formObjectErrors.required) {
          this.toast.show(formObject.label + ' must not be empty', 'Register', Toast.Error);

        } else if (formObjectErrors.validator) {
          this.toast.show(formObject.label + ' ' + formObjectErrors.validator, 'Register', Toast.Error);

        }
        errors = true;
      }
    });
    if (errors) return;

    const roles = ['user'];

    let userRegister: UserRegister = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      roles,
      description: 'Cet utilisateur est spectaculaire !',
      flag: navigator.language.substring(0, 2),
      level: 1,
      exp: 0,
      expNextLevel: 80,
      points: 0,
      createdAt: new Date()
    }

    this.authService.register(userRegister).subscribe((res) => {
      if (res.usernameAlreadyUsed) {
        this.toast.show('Ce nom d\'utilisateur est déjà utilisé.', 'Inscription', Toast.Error);

      } else if (res.emailAlreadyUsed) {
        this.toast.show('Cette adresse email est déjà utilisée.', 'Inscription', Toast.Error);

      } else {
        this.toast.show('Inscription réussie.', 'Connexion', Toast.Success);
        const userLogin: UserLogin = {
          username: this.form.get('username').value,
          password: this.form.get('password').value
        };

        this.authService.signIn(userLogin).subscribe((res) => {

        });
      }
    });
  }
}
