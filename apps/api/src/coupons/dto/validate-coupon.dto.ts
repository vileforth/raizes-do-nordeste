import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  unitId?: number;
}
