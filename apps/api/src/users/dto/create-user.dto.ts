import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({ enum: UserStatus, example: UserStatus.ATIVO })
  @IsEnum(UserStatus)
  status!: UserStatus;
}
