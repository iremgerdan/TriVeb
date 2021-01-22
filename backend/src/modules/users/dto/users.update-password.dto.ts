import { IsString, Length, Matches } from 'class-validator';

export class UsersUpdatePasswordDto {
  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  currentPassword: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  newPassword: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  newPasswordConfirmation: string;
}
