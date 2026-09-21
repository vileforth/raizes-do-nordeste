import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  unitId!: number;

  @ApiProperty()
  registrationNumber!: string;

  @ApiProperty()
  role!: string;

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
  registeredAt!: Date;

  @ApiProperty()
  unitName!: string;
}
