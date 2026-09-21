import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import {
  assertAnyRole,
  hasRole,
  resolveManagerUnitId,
} from '../common/utils/access-scope.util';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPaginated,
  normalizePagination,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { UpdateStockProductDto } from './dto/update-stock-product.dto';
import {
  StockProductResponseDto,
  UnitStockResponseDto,
} from './dto/stock-response.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getUnitStock(
    actor: AuthenticatedUser,
    unitId: number,
  ): Promise<UnitStockResponseDto> {
    await this.assertCanAccessUnit(actor, unitId);

    const stock = await this.prisma.stock.findUnique({
      where: { unitId },
      include: {
        stockProducts: {
          include: { product: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found for unit');
    }

    return this.toUnitStockResponse(stock);
  }

  async updateStockProduct(
    actor: AuthenticatedUser,
    stockProductId: number,
    dto: UpdateStockProductDto,
  ): Promise<StockProductResponseDto> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);

    const stockProduct = await this.prisma.stockProduct.findUnique({
      where: { id: stockProductId },
      include: {
        stock: true,
        product: true,
      },
    });

    if (!stockProduct) {
      throw new NotFoundException('Stock product not found');
    }

    await this.assertCanAccessUnit(actor, stockProduct.stock.unitId);

    const updated = await this.prisma.stockProduct.update({
      where: { id: stockProductId },
      data: dto,
      include: { product: true },
    });

    this.logger.info('Stock product updated', {
      stockProductId,
      actorId: actor.id,
    });

    return this.toStockProductResponse(updated);
  }

  async removeStockProduct(
    actor: AuthenticatedUser,
    stockProductId: number,
  ): Promise<void> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);
    const stockProduct = await this.prisma.stockProduct.findUnique({
      where: { id: stockProductId },
      include: { stock: true },
    });
    if (!stockProduct) {
      throw new NotFoundException('Stock product not found');
    }
    await this.assertCanAccessUnit(actor, stockProduct.stock.unitId);
    await this.prisma.stockProduct.delete({ where: { id: stockProductId } });
    this.logger.info('Stock product removed', {
      stockProductId,
      actorId: actor.id,
    });
  }

  async findLowStock(
    actor: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<StockProductResponseDto>> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);

    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const unitFilter = hasRole(actor, UserRole.ADMINISTRADOR)
      ? {}
      : { stock: { unitId: await resolveManagerUnitId(this.prisma, actor.id) } };
    const productSearch = search
      ? { product: { name: { contains: search, mode: 'insensitive' as const } } }
      : {};

    const stockProducts = await this.prisma.stockProduct.findMany({
      where: { ...unitFilter, ...productSearch },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    const lowStock = stockProducts
      .filter((item) => item.quantity <= item.minimumStock)
      .map((item) => this.toStockProductResponse(item));
    const total = lowStock.length;
    return buildPaginated(lowStock.slice(skip, skip + take), page, pageSize, total);
  }

  private async assertCanAccessUnit(
    actor: AuthenticatedUser,
    unitId: number,
  ): Promise<void> {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      return;
    }

    if (hasRole(actor, UserRole.GERENTE)) {
      const managerUnitId = await resolveManagerUnitId(this.prisma, actor.id);
      if (managerUnitId === unitId) {
        return;
      }
    }

    throw new ForbiddenException('Insufficient role permissions');
  }

  private toUnitStockResponse(stock: {
    id: number;
    unitId: number;
    status: string;
    stockProducts: Array<{
      id: number;
      productId: number;
      quantity: number;
      minimumStock: number;
      product: { name: string };
    }>;
  }): UnitStockResponseDto {
    return {
      stockId: stock.id,
      unitId: stock.unitId,
      status: stock.status,
      products: stock.stockProducts.map((item) => this.toStockProductResponse(item)),
    };
  }

  private toStockProductResponse(item: {
    id: number;
    productId: number;
    quantity: number;
    minimumStock: number;
    product: { name: string };
  }): StockProductResponseDto {
    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      minimumStock: item.minimumStock,
    };
  }
}
