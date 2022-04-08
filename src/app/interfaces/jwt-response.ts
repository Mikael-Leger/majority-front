export interface JwtResponseRegister {
  usernameAlreadyUsed: boolean,
  emailAlreadyUsed: boolean
}
export interface JwtResponseLogin {
  id: number,
  username: string,
  email: string,
  roles: string[],
  accessToken: string,
  userNotFound: boolean,
  passwordInvalid: boolean
}
