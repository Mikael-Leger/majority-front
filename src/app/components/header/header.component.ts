import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string = '';
  roles: string[] = [];

  menuItems = [];
  dropdownItems = [];

  constructor(private authService : AuthService, private userService: UserService, private router: Router) {
    router.events.subscribe((value) => {
      this.menuItems.forEach(menuItem => {
        menuItem.selected = ( window.location.href.indexOf(menuItem.link) != -1);

      });
    });
    authService.username.subscribe(value => {
      this.username = value;

    });
    authService.roles.subscribe(value => {
      this.roles = value;

    });
  }

  ngOnInit(): void {
    console.log("nginit header");
    const id = localStorage.getItem('ID');
    const token = localStorage.getItem('ACCESS_TOKEN');
    console.log("test : %s - %s", id, token);
    if (!this.authService.isAuthenticated()) {
      console.log("not auth");

      this.username = 'Not connected';
      this.roles = ['VISITOR'];

    }
    console.log("auth");
    this.setMenuItems();

  }

  setMenuItems(): void {
    console.log("setMenuItems");

    this.authService.roles.subscribe(value => {
      console.log("value :");
      console.log(value);

      this.roles = value;
      this.menuItems = [
        {
          link: '/ranking',
          label: 'Ranking',
          showIf: true,
          selected: false
        },
        {
          link: '/start',
          label: 'Start',
          showIf: this.roles.includes('ROLE_USER'),
          selected: false
        },
        {
          link: '/questions',
          label: 'Questions',
          showIf: this.roles.includes('ROLE_MODERATOR') || this.roles.includes('ROLE_ADMIN'),
          selected: false
        }
      ];
      this.dropdownItems = [
        {
          link: '/register',
          label: 'Register',
          showIf: !this.roles.includes('ROLE_USER'),
          routerLink: true
        },
        {
          link: '/login',
          label: 'Login',
          showIf: !this.roles.includes('ROLE_USER'),
          routerLink: true
        },
        {
          link: '/profile/' + this.username,
          label: 'Profile',
          showIf: this.roles.includes('ROLE_USER'),
          routerLink: true
        },
        {
          link: '',
          label: 'Logout',
          showIf: this.roles.includes('ROLE_USER'),
          routerLink: false
        }
      ];
    });
  }

  logout() {
    this.authService.logout();

  }

}
