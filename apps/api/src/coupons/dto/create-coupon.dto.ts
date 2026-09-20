import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  promotionId!: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  expiry!: Date;

  @ApiProperty()
  @IsInt()
  @Min(1)
  usageLimit!: number;

  @ApiProperty()
  @IsBoolean()
  active!: boolean;
}
