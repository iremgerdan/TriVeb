import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

import queryHelper from 'src/shared/helpers/query.helper';

export class UsersLookupDto {
  @IsOptional()
  @Transform((value: string) => value.split(',').map((id) => +id))
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids?: number[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map((fullname) => fullname.trim()))
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 256, { each: true })
  fullnames?: string[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map((date) => (date.trim() === '' ? '' : new Date(date)));
    return queryHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  creationTimeSlice?: Date[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map((date) => (date.trim() === '' ? '' : new Date(date)));
    return queryHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  updationTimeSlice?: Date[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map((searchItem) => searchItem.trim()))
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 240, { each: true })
  search?: string[];

  @IsOptional()
  @Matches(/^[A-Za-z_]+-?(,[A-Za-z_]+-?)*$/)
  order?: string;

  @IsOptional()
  @Matches(/^[A-Za-z_]+(,[A-Za-z_]+)*$/)
  attributes?: string;

  @IsOptional()
  @Matches(/^[0-9]+(\.[1-9])?(,[0-9]+(\.[1-9])?)?$/)
  page?: string;
}
