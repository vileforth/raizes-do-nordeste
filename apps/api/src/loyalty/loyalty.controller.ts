import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { RedeemBenefitDto } from './dto/redeem-benefit.dto';
import { LoyaltyService } from './loyalty.service';

@ApiTags('loyalty')
@Controller()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('loyalty/program')
  @ApiOperation({ summary: 'Get active loyalty program' })
  getProgram() {
    return this.loyaltyService.getProgram();
  }

  @Get('clients/:id/loyalty')
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.ATENDENTE,
    UserRole.CLIENTE,
  )
  @ApiOperation({ summary: 'Get client loyalty profile' })
  getClientLoyalty(@Param('id', ParseIntPipe) id: number) {
    return this.loyaltyService.getClientLoyalty(id);
  }

  @Get('clients/:id/points')
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.ATENDENTE,
    UserRole.CLIENTE,
  )
  @ApiOperation({ summary: 'Get client point movements' })
  getClientPoints(@Param('id', ParseIntPipe) id: number) {
    return this.loyaltyService.getClientPoints(id);
  }

  @Get('benefits')
  @ApiOperation({ summary: 'List available benefits' })
  getBenefits() {
    return this.loyaltyService.getBenefits();
  }

  @Post('benefits/:id/redeem')
  @Roles(UserRole.ATENDENTE, UserRole.CLIENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Redeem benefit for client' })
  redeemBenefit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RedeemBenefitDto,
  ) {
    return this.loyaltyService.redeemBenefit(id, dto.clientId);
  }
}
