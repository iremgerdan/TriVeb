import { Transform } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';

export class UsersUpdateProfileDto {
  @IsOptional()
  @Transform((value: string) => value.trim())
  @Length(1, 256)
  fullname?: string;
}
