import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUser {
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}
