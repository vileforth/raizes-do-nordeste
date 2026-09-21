import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { PaginationQueryDto } from '../common/pagination/pagination.query';
import { AssociateProductsDto } from './dto/associate-products.dto';
import { AssociateUnitsDto } from './dto/associate-units.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsService } from './promotions.service';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
  )
  @ApiOperation({ summary: 'List promotions scoped by role' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.promotionsService.findAll(user, query);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
  )
  @ApiOperation({ summary: 'Get promotion by id' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.promotionsService.findOne(id, user);
  }

  @Post()
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create promotion' })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update promotion' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Activate promotion' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.activate(id);
  }

  @Post(':id/units')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Associate promotion with units' })
  associateUnits(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssociateUnitsDto,
  ) {
    return this.promotionsService.associateUnits(id, dto.unitIds);
  }

  @Post(':id/products')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Associate promotion with products' })
  associateProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssociateProductsDto,
  ) {
    return this.promotionsService.associateProducts(id, dto.productIds);
  }
}
