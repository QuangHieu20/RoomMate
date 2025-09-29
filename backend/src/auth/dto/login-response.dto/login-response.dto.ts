export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
  };
}
