/**
 * Session domain types.
 *
 * Role vocabulary is dictated by the backend:
 * - `'user'`  => admin (can manage entities)
 * - `'member'` => student
 */
export type UserRole = 'user' | 'member';

/** Safe user shape returned by the backend (no password / refresh token). */
export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  isVerified: boolean;
  major?: string;
  image?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  provider?: 'local' | 'google';
  /** True once the account has a password set (always true for local users). */
  hasPassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
