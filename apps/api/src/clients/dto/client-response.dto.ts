import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientLastOrderDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  orderCode!: string;

  @ApiProperty()
  totalValue!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  status!: string;
}

export class ClientResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  cpf!: string;

  @ApiProperty()
  registeredAt!: Date;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  userStatus!: string;

  @ApiProperty()
  ordersCount!: number;

  @ApiProperty()
  ticketsCount!: number;

  @ApiPropertyOptional({ nullable: true })
  loyaltyLevel!: string | null;

  @ApiPropertyOptional({ nullable: true })
  pointsBalance!: number | null;

  @ApiPropertyOptional({ type: ClientLastOrderDto, nullable: true })
  lastOrder!: ClientLastOrderDto | null;
}
