import { ApiProperty } from '@nestjs/swagger';

export class StockProductResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  productId!: number;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  minimumStock!: number;
}

export class UnitStockResponseDto {
  @ApiProperty()
  stockId!: number;

  @ApiProperty()
  unitId!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: [StockProductResponseDto] })
  products!: StockProductResponseDto[];
}
