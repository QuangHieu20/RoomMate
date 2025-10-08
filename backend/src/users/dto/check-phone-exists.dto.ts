import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CheckPhoneExistsDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;
}
