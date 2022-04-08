import { Message } from '../interfaces/message';

export interface Friend {
  id: number;
  username: string;
  flag: string;
  level: number;
  status: string;
  messages: Message[];
  expanded: boolean;
}
