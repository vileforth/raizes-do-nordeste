import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';

export class UnitResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty({ enum: UnitStatus })
  status!: UnitStatus;

  @ApiProperty()
  registeredAt!: Date;

  @ApiPropertyOptional()
  latitude?: number | null;

  @ApiPropertyOptional()
  longitude?: number | null;
}
