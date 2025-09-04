export interface UserType {
  id: number;
  email: string;
  password: string;
  nickname: string;
  profile_image: string;
  is_verified: boolean;
  email_verification_token: string;
  createdAt: Date;
  updatedAt: Date;
}
