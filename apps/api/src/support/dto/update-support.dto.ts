import { ApiPropertyOptional } from '@nestjs/swagger';
import { SupportStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSupportDto {
  @ApiPropertyOptional({ enum: SupportStatus })
  @IsOptional()
  @IsEnum(SupportStatus)
  status?: SupportStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  responsibleUserId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
