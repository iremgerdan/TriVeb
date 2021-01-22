import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UsersCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  password: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  passwordConfirmation: string;

  @IsString()
  @Length(1, 256)
  @Matches(/[^\s]/)
  fullname: string;
}
