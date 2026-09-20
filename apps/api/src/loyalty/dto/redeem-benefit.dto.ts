import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class RedeemBenefitDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  clientId!: number;
}
