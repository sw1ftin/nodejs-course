export enum UserType {
  REGULAR = 'regular',
  PRO = 'pro'
}

export function isUserType(value: unknown): UserType | undefined {
  return Object.values(UserType).includes(value as UserType) ? (value as UserType) : undefined;
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
}

