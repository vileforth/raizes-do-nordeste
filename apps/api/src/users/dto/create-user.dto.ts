import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '11999999999' })
  @IsString()
  @MinLength(8)
  phone!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ATIVO })
  @IsEnum(UserStatus)
  status!: UserStatus;

  @ApiProperty({ enum: UserRole, isArray: true, example: [UserRole.ATENDENTE] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  profileNames!: UserRole[];
}
