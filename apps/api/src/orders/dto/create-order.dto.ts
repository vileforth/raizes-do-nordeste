import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsumptionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  clientId?: number;

  @ApiProperty()
  @IsInt()
  unitId: number;

  @ApiProperty({ enum: ConsumptionType })
  @IsEnum(ConsumptionType)
  consumptionType: ConsumptionType;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
