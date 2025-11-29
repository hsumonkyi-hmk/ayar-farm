export interface User {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  user_type: string;
  profile_picture: string | null;
  location: string | null;
  gender: string | null;
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}
