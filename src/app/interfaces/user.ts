export interface UserLogin {
    username: string;
    password: string;
}

export interface UserRegister {
  username: string;
  description: string;
  email: string;
  password: string;
  roles: string[];
  flag: string;
  level: number;
  points: number;
  exp: number;
  expNextLevel: number;
  createdAt: Date;
}

export interface User {
  id: number;
  username: string;
  description: string;
  email: string;
  roles: string[];
  flag: string;
  level: number;
  points: number;
  exp: number;
  expNextLevel: number;
  rank: number;
  createdAt: Date;
}
