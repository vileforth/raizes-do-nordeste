import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Create a pending payment for an order' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get(':id')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Get payment by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Post(':id/confirm')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Confirm a pending payment' })
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.confirm(id);
  }
}
