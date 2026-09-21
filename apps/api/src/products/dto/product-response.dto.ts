import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  active!: boolean;
}
