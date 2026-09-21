import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  active!: boolean;
}
