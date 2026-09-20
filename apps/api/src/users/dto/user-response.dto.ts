import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { UserRole } from '@raizes/shared';

export class UserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty()
  registeredAt!: Date;

  @ApiProperty({ enum: UserRole, isArray: true })
  profiles!: UserRole[];
}
