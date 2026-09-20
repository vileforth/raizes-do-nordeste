import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty()
  @IsInt()
  unitId!: number;

  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  @MinLength(3)
  registrationNumber!: string;

  @ApiProperty({ example: 'Attendant' })
  @IsString()
  @MinLength(2)
  role!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active!: boolean;
}
