import { ApiProperty } from '@nestjs/swagger';
import { SupportType } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ enum: SupportType })
  @IsEnum(SupportType)
  type!: SupportType;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description!: string;
}
