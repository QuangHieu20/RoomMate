import { IsNotEmpty } from 'class-validator';

export class GetPostsByUserIdDto {
  @IsNotEmpty()
  userId: string;
}
