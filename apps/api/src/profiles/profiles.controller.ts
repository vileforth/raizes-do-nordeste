import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'List profiles' })
  @ApiResponse({ status: 200, type: [ProfileResponseDto] })
  findAll(): Promise<ProfileResponseDto[]> {
    return this.profilesService.findAll();
  }
}
