import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageResponse, MessageUserResponse } from '../interfaces/game-response';
import { UsersAndRankResponse } from '../interfaces/ranking-response';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USER_SERVER = 'https://majority-back.herokuapp.com/api/user';

  constructor(private httpClient: HttpClient) { }

  getUserId(): number {
    return parseInt(localStorage.getItem('ID'));
  }

  getUser(username: string = ''): Observable<MessageUserResponse> {
    const userId = localStorage.getItem('ID');
    const data = (username == '') ? userId : username;
    return this.httpClient.get<MessageUserResponse>(`${this.USER_SERVER}/user/${data}`).pipe(
      tap((res: MessageUserResponse) => {

      })
    );
  }

  getFirstTenUsers(flag: string = null): Observable<User[]> {
    const data = (flag == null) ? '' : '/' + flag;
    return this.httpClient.get<User[]>(`${this.USER_SERVER}/ten-users${data}`).pipe(
      tap((res: User[]) => {
      })
    );
  }

  getAllUsersAndRank(user: User, type: string = 'global'): Observable<UsersAndRankResponse> {
    return this.httpClient.post<UsersAndRankResponse>(`${this.USER_SERVER}/users/`, {userId: user.id, flag: user.flag, type}).pipe(
      tap((res: UsersAndRankResponse) => {
      })
    );
  }

  setDescription(userId: number, description: string): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(`${this.USER_SERVER}/description`, {userId, description}).pipe(
      tap((res: MessageResponse) => {
      })
    );
  }

  setStatus(status: string): Observable<MessageResponse> {
    const userId = this.getUserId();
    return this.httpClient.put<MessageResponse>(`${this.USER_SERVER}/status`, {userId, status}).pipe(
      tap((res: MessageResponse) => {
      })
    );
  }

  deleteUser(userId: number): Observable<MessageResponse> {
    return this.httpClient.delete<MessageResponse>(`${this.USER_SERVER}/${userId}`).pipe(
      tap((res: MessageResponse) => {
      })
    );
  }

}
