import { Friend } from './friend';

export interface FriendResponse {
  friendsList: Friend[],
  numberConnected: number
}
