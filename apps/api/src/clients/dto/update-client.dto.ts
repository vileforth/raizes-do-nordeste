import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: '12345678901' })
  @IsOptional()
  @IsString()
  @MinLength(11)
  cpf?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
