import { User } from '../interfaces/user';

export interface GameResponse {
  message: string,
  gameId: number
}

export interface MessageResponse {
  message: string
}

export interface MessageUserResponse {
  message: string
  user: User;
}
