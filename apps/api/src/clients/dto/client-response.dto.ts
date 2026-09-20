import { ApiProperty } from '@nestjs/swagger';

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
}
