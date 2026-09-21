import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { Decimal } from '@prisma/client/runtime/library';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { assertAnyRole } from '../common/utils/access-scope.util';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPaginated,
  normalizePagination,
  resolveOrderBy,
  searchContains,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(query: PaginationInput = {}): Promise<Paginated<ProductResponseDto>> {
    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const where = searchContains(['name', 'category'], search) ?? {};
    const orderBy = resolveOrderBy(query.orderBy, ['id', 'name', 'category'], {
      id: 'asc',
    });
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy, skip, take }),
      this.prisma.product.count({ where }),
    ]);

    return buildPaginated(
      products.map((product) => this.toResponse(product)),
      page,
      pageSize,
      total,
    );
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.getProductOrThrow(id);
    return this.toResponse(product);
  }

  async create(actor: AuthenticatedUser, dto: CreateProductDto): Promise<ProductResponseDto> {
    this.assertCanWrite(actor);

    const product = await this.prisma.product.create({
      data: {
        ...dto,
        price: new Decimal(dto.price),
      },
    });

    this.logger.info('Product created', { productId: product.id, actorId: actor.id });
    return this.toResponse(product);
  }

  async update(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    this.assertCanWrite(actor);
    await this.getProductOrThrow(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.price !== undefined ? { price: new Decimal(dto.price) } : {}),
      },
    });

    this.logger.info('Product updated', { productId: id, actorId: actor.id });
    return this.toResponse(product);
  }

  private assertCanWrite(actor: AuthenticatedUser): void {
    try {
      assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);
    } catch {
      throw new ForbiddenException('Insufficient role permissions');
    }
  }

  private async getProductOrThrow(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private toResponse(product: {
    id: number;
    name: string;
    description: string;
    price: Decimal;
    category: string;
    active: boolean;
  }): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      active: product.active,
    };
  }
}
