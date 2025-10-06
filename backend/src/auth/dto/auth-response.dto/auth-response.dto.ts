export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string | null;
  };
}
