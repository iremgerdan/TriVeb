import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UsersLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  password: string;
}
