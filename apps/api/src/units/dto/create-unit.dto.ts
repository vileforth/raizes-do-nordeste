import { ApiProperty } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Unit Center' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Rua A, 100, Recife' })
  @IsString()
  @MinLength(5)
  address!: string;

  @ApiProperty({ example: '81999999999' })
  @IsString()
  @MinLength(8)
  phone!: string;

  @ApiProperty({ enum: UnitStatus, example: UnitStatus.ATIVA })
  @IsEnum(UnitStatus)
  status!: UnitStatus;
}
