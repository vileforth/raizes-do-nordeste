import { ApiProperty } from '@nestjs/swagger';
import { PromotionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  rule!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({ enum: PromotionStatus, required: false })
  @IsOptional()
  @IsEnum(PromotionStatus)
  status?: PromotionStatus;
}
