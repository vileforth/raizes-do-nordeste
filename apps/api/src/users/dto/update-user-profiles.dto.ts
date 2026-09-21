import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';

export class UpdateUserProfilesDto {
  @ApiProperty({ enum: UserRole, isArray: true, example: [UserRole.CLIENTE] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  profileNames!: UserRole[];
}
