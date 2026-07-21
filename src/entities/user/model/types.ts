export type UserRole = 'user' | 'member';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  isVerified: boolean;
  major?: string;
  image?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  major?: string;
  points?: number;
  isVerified?: boolean;
  image?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  major?: string;
  role?: UserRole;
  points?: number;
  isVerified?: boolean;
  image?: string;
}
