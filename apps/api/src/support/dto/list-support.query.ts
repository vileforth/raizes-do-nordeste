import { ApiPropertyOptional } from '@nestjs/swagger';
import { SupportStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination.query';

export class ListSupportQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: SupportStatus })
  @IsOptional()
  @IsEnum(SupportStatus)
  status?: SupportStatus;
}
