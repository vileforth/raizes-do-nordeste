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
}
