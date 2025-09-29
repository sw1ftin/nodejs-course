export enum UserType {
  REGULAR = 'regular',
  PRO = 'pro'
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
}

