import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
