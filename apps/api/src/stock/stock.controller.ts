import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { UpdateStockProductDto } from './dto/update-stock-product.dto';
import {
  StockProductResponseDto,
  UnitStockResponseDto,
} from './dto/stock-response.dto';
import { StockService } from './stock.service';

@ApiTags('stock')
@ApiBearerAuth()
@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('units/:id/stock')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Get unit stock' })
  @ApiResponse({ status: 200, type: UnitStockResponseDto })
  getUnitStock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UnitStockResponseDto> {
    return this.stockService.getUnitStock(user, id);
  }

  @Patch('stock/products/:id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update stock product quantity' })
  @ApiResponse({ status: 200, type: StockProductResponseDto })
  updateStockProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockProductDto,
  ): Promise<StockProductResponseDto> {
    return this.stockService.updateStockProduct(user, id, dto);
  }

  @Get('stock/low')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'List low stock products' })
  @ApiResponse({ status: 200, type: [StockProductResponseDto] })
  findLowStock(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<StockProductResponseDto[]> {
    return this.stockService.findLowStock(user);
  }
}
