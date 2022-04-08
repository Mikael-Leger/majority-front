import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authenticated: boolean;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated();

  }
}
