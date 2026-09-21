import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Tapioca' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'Traditional tapioca' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'Snacks' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
