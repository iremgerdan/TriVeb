import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class UsersUpdateEmailDto {
  @Transform((value: string) => value.trim())
  @IsEmail()
  email: string;
}
