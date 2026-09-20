import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('root')
@Controller()
@Public()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root status' })
  getStatus() {
    return { status: 'ok' };
  }
}
