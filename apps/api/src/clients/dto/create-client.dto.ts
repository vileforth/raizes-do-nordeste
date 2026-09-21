import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @MinLength(11)
  cpf!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: 'Rua Setúbal, 120 - Boa Viagem' })
  @IsString()
  @MinLength(5)
  address!: string;

  @ApiProperty({ example: 'Recife' })
  @IsString()
  @MinLength(2)
  city!: string;

  @ApiProperty({ example: 'PE' })
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiProperty({ example: '51020000' })
  @IsString()
  @MinLength(8)
  zipCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  preferredUnitId?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  active!: boolean;
}
