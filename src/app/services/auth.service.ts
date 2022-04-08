import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserLogin, UserRegister } from '../interfaces/user';
import { JwtResponseRegister, JwtResponseLogin } from '../interfaces/jwt-response';

import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { MessageResponse } from '../interfaces/game-response';
import { FriendsService } from './friends.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER = 'https://majority-back.herokuapp.com/api/auth';
  authSubject = new BehaviorSubject(false);
  username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  roles: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private httpClient: HttpClient, private userService: UserService, private friendsService: FriendsService, private router: Router) { }

  register(user: UserRegister): Observable<JwtResponseRegister> {
    return this.httpClient.post<JwtResponseRegister>(`${this.AUTH_SERVER}/signup`, user).pipe(
      tap((res: JwtResponseRegister) => {
      })
    );
  }

  signIn(user: UserLogin): Observable<JwtResponseLogin> {
    return this.httpClient.post(`${this.AUTH_SERVER}/signin`, user).pipe(

      tap((res: JwtResponseLogin) => {
        localStorage.setItem('ID', res.id.toString());
        localStorage.setItem('ACCESS_TOKEN', res.accessToken);
        if (res.roles.includes('ROLE_MODERATOR')) localStorage.setItem('ROLE', 'moderator');
        else if (res.roles.includes('ROLE_ADMIN')) localStorage.setItem('ROLE', 'admin');
        else localStorage.setItem('ROLE', 'user');
        this.authSubject.next(true);
        this.username.next(res.username);
        this.roles.next(res.roles);
        this.friendsService.showFriendsList.next(true);
        this.userService.setStatus('connected').subscribe(res => {
          // window.location.reload();

        });
      })
    );
  }

  tokenExpired(): boolean {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;

    } else {
      return false;

    }
  }

  logout(): void {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USERNAME');
    localStorage.removeItem('ROLE');
    localStorage.removeItem('friendsListExpanded')
    for (let i = 0; i < 3; i++) {
      localStorage.removeItem('message-' + i);

    }
    this.authSubject.next(false);
    this.username.next('Not connected');
    this.roles.next(['VISITOR']);
    this.userService.setStatus('disconnected').subscribe(res => {
      localStorage.removeItem('ID');
      this.friendsService.showFriendsList.next(false);
      this.router.navigateByUrl('/login');

    });
  }

  setUserInfos(): void {
    this.userService.getUser().subscribe(messageUser => {
      this.username.next(messageUser.user.username);
      this.roles.next(messageUser.user.roles);

    })
  }

  startCountdownForStatus(): Observable<MessageResponse> {
    const userId = this.userService.getUserId();
    return this.httpClient.post<MessageResponse>(`${this.AUTH_SERVER}/countdown/start`, {userId});
  }

  refreshCountdownForStatus(): Observable<MessageResponse> {
    const userId = this.userService.getUserId();
    return this.httpClient.post<MessageResponse>(`${this.AUTH_SERVER}/countdown/refresh`, {userId});
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return token ? true : false;
  }

  isAdmin(): boolean {
    return (localStorage.getItem('ROLE') == 'admin') ? true : false;
  }

  isModerator(): boolean {
    return (localStorage.getItem('ROLE') == 'moderator') ? true : false;
  }

  isUser(): boolean {
    return (this.isAuthenticated && !this.isModerator && !this.isAdmin()) ? true : false;
  }

}
