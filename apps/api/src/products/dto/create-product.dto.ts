import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Tapioca' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Traditional tapioca' })
  @IsString()
  @MinLength(2)
  description!: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'Snacks' })
  @IsString()
  @MinLength(2)
  category!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active!: boolean;
}
