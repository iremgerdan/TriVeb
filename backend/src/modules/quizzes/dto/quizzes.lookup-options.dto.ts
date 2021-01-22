import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QuizzesLookupOptionsDto {
  @IsOptional()
  @Transform((value: string) => value.trim() === 'true')
  @IsBoolean()
  isRaw?: boolean;
}
