import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @MinLength(11)
  cpf!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  active!: boolean;
}
