import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameResponse, MessageResponse } from '../interfaces/game-response';
import { Game } from '../interfaces/game';
import { tap } from 'rxjs/operators';
import { Player } from '../interfaces/player';
import { Question } from '../interfaces/question';

const baseUrl = 'http://localhost:8080/api/questions';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  GAME_SERVER = 'http://localhost:8080/api/game';

  inGame: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private httpClient: HttpClient) { }

  joinGame(gameId: number = null): Observable<GameResponse> {
    return this.httpClient.post<GameResponse>(`${this.GAME_SERVER}/join`, {userId: this.getUserId(), gameId}).pipe(
      tap((res: GameResponse) => {
      })
    );
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('ID'));
  }

  getGame(gameId: number): Observable<Game> {
    return this.httpClient.get<Game>(`${this.GAME_SERVER}/${gameId}`).pipe(
      tap((res: Game) => {
      })
    );
  }

  getPlayers(gameId: number): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${this.GAME_SERVER}/players/${gameId}`).pipe(
      tap((res: Player[]) => {
      })
    );
  }

  getQuestion(gameId: number): Observable<Question> {
    return this.httpClient.get<Question>(`${this.GAME_SERVER}/question/${gameId}`).pipe(
      tap((res: Question) => {

      })
    );
  }

  vote(gameId: number, userId: number, answer: string): Observable<GameResponse> {
    return this.httpClient.put<GameResponse>(`${this.GAME_SERVER}/vote`, {gameId, userId, answer}).pipe(
      tap((res: GameResponse) => {

      })
    );
  }

  setQuestionNumber(gameId: number, nb_question: number): Observable<GameResponse> {
    return this.httpClient.put<GameResponse>(`${this.GAME_SERVER}/nb_question`, {gameId, nb_question}).pipe(
      tap((res: GameResponse) => {

      })
    );
  }

  setLifes(gameId: number, userId: number, lifes: number): Observable<GameResponse> {
    return this.httpClient.put<GameResponse>(`${this.GAME_SERVER}/lifes`, {gameId, userId, lifes}).pipe(
      tap((res: GameResponse) => {

      })
    );

  }

  updateUserStats(player: Player): Observable<MessageResponse> {
    const exp = (player.lifes) ? 35 : 20;
    return this.httpClient.put<MessageResponse>(`${this.GAME_SERVER}/user`, {"userId": player.id, exp, "points": player.lifes * 5}).pipe(
      tap((res: MessageResponse) => {

      })
    );
  }

  updateUsersStats(players: Player[]): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(`${this.GAME_SERVER}/users`, {players}).pipe(
      tap((res: MessageResponse) => {

      })
    );
  }

  start(gameId: number): Observable<GameResponse> {
    return this.httpClient.post<GameResponse>(`${this.GAME_SERVER}/start`, {gameId}).pipe(
      tap((res: GameResponse) => {

      })
    );
  }

  removePlayer(gameId: number, userId: number): Observable<MessageResponse> {
    return this.httpClient.delete<MessageResponse>(`${this.GAME_SERVER}/user/${gameId}/${userId}`).pipe(
      tap((res: MessageResponse) => {

      })
    );
  }

  deleteGame(id: number): Observable<GameResponse>  {
    return this.httpClient.delete<GameResponse>(`${this.GAME_SERVER}/${id}`).pipe(
      tap((res: GameResponse) => {

      })
    );
  }
}
