import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersAndRankResponse } from 'src/app/interfaces/ranking-response';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  users: User[];
  globalButton: boolean = true;
  regionButton: boolean = false;
  pageIndex: number = 0;
  rank: number = 0;
  username: string = 'Your';

  displayedColumns: string[] = ['rank', 'username', 'level', 'points'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {

  }

  ngOnInit(): void {
    this.getUsers('global');

  }

  backToTop(): void {
    this.dataSource.paginator.pageSize = 10;
    this.dataSource.paginator.pageIndex = 0;
    this.dataSource.sort = this.sort;

  }

  backToPosition(): void {
    this.dataSource.paginator.pageSize = 10;
    this.dataSource.paginator.pageIndex = (this.rank >= 10) ? parseInt(String(this.rank)[0]) : 0;
    this.dataSource.sort = this.sort;

  }

  getUsers(type: string): void {
    console.log("getUsers");

    let username = this.route.snapshot.paramMap.get('username');
    if (username == null) {
      username = '';

    } else {
      this.username = username;

    }
    this.userService.getUser(username).subscribe(messageUser => {
      if (type === 'global') {
        this.globalButton = true;
        this.regionButton = false;
        this.userService.getAllUsersAndRank(messageUser.user).subscribe(res => {
          this.setInfosFromRes(res);

        });
      } else if (type === 'region') {
        this.regionButton = true;
        this.globalButton = false;
        this.userService.getUser().subscribe(res => {
          this.userService.getAllUsersAndRank(res.user, 'region').subscribe(res => {
            this.setInfosFromRes(res);

          });
        })
      }
    });
  }

  setInfosFromRes(res: UsersAndRankResponse): void {
    this.users = res.users;
    this.dataSource = new MatTableDataSource(this.users);
    this.rank = res.rank;
    this.pageIndex = (res.rank >= 10) ? parseInt(String(res.rank)[0]) : 0;
    this.paginator.pageIndex = this.pageIndex;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
