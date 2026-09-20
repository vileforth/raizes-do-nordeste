import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  expiresIn!: number;

  @ApiProperty({ example: 'bearer' })
  tokenType!: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: 'Password recovery email sent' })
  message!: string;
}

export class RegisterResponseDto extends AuthTokenResponseDto {
  @ApiProperty()
  userId!: number;
}
