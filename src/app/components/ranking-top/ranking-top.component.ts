import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ranking-top',
  templateUrl: './ranking-top.component.html',
  styleUrls: ['./ranking-top.component.css']
})
export class RankingTopComponent implements OnInit {
  users: User[];

  globalButton: boolean = true;
  regionButton: boolean = false;

  constructor(private router: Router, private userService: UserService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);

      }
    });
  }

  ngOnInit(): void {
    this.getFirstTenUsers('global');
  }

  getFirstTenUsers(type: string): void {
    if (type === 'global') {
      this.globalButton = true;
      this.regionButton = false;
      this.userService.getFirstTenUsers().subscribe(users => {
        this.users = users;

      });
    } else if (type === 'region') {
      this.regionButton = true;
      this.globalButton = false;
      this.userService.getUser().subscribe(res => {
        this.userService.getFirstTenUsers(res.user.flag).subscribe(users => {
          this.users = users;

        });
      })
    }
  }

}
