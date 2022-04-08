import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Majority';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.logOutIfTokenExpired();
    setTimeout(() => {
      this.userService.setStatus('away').subscribe(res => {

      });
    }, 300000);
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    // start counter for auto disconnect to backend
    this.authService.startCountdownForStatus().subscribe(res => {
      this.logOutIfTokenExpired();

    });
  }

  logOutIfTokenExpired(): void {
    if (this.authService.tokenExpired()) {
      this.authService.logout();

    } else if (this.authService.isAuthenticated()) {
      // refresh auto disconnect to backend
      this.authService.refreshCountdownForStatus().subscribe(res => {

      });
      this.authService.setUserInfos();
    }
  }

}
