import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import { FriendResponse } from '../interfaces/friend-response';
import { Friend } from '../interfaces/friend';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  FRIEND_SERVER = 'https://majority-back.herokuapp.com/api/friendship';

  showFriendsList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) { }

  getFriend(username: string = ''): Observable<Friend> {
    const friendId = localStorage.getItem('ID');
    const data = (username == '') ? friendId : username;
    return this.httpClient.get<Friend>(`${this.FRIEND_SERVER}/${data}`).pipe(
      tap((res: Friend) => {
      })

    );
  }

  getFriendsList(status: string): Observable<FriendResponse> {
    const userId = parseInt(localStorage.getItem('ID'));
    return this.httpClient.get<FriendResponse>(`${this.FRIEND_SERVER}/${status}/${userId}`).pipe(
      tap((res: FriendResponse) => {
      })
    );
  }

  getMessages(userId: number, friendId: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.FRIEND_SERVER}/messages/${userId}/${friendId}`).pipe(
      tap((res: Message[]) => {
      })
    );
  }
  sendMessage(userId: number, friendId: number, message: string): Observable<Message> {
    return this.httpClient.post<Message>(`${this.FRIEND_SERVER}/message`, {userId, friendId, message}).pipe(
      tap((res: Message) => {
      })
    );
  }

  inviteToGame(user: User, friend: Friend, gameId: number): Observable<Message> {
    return this.httpClient.post<Message>(`${this.FRIEND_SERVER}/invite`, {user, friend, gameId}).pipe(
      tap((res: Message) => {
      })
    );
  }

  addFriend(userId: number, userId2: number): Observable<Message> {
    return this.httpClient.post<Message>(`${this.FRIEND_SERVER}/add`, {userId, userId2}).pipe(
      tap((res: Message) => {
      })
    );
  }

  removeFriend(userId: number, friendId: number): Observable<Message> {
    return this.httpClient.delete<Message>(`${this.FRIEND_SERVER}/remove/${userId}/${friendId}`).pipe(
      tap((res: Message) => {
      })
    );
  }

  answerInvitation(userId: number, friendId: number, accepted: boolean): Observable<Message> {
    return this.httpClient.put<Message>(`${this.FRIEND_SERVER}/answer`, {userId, friendId, accepted}).pipe(
      tap((res: Message) => {
      })
    );
  }

  isUserInFriendsList(userId: number, friendId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.FRIEND_SERVER}/user-in-friends-list`, {userId, friendId}).pipe(
      tap((res: boolean) => {
      })
    );
  }

}
