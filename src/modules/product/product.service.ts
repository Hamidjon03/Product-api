// src/product/product.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Express } from 'express';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Check if product with same name already exists
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    // Create product with image URL
    const product = this.productRepository.create({
      ...createProductDto,
      imageUrl: `/uploads/products/${file.filename}`,
    });

    // Use transaction for data consistency
    return this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save(product);
      },
    );
  }

  async findAll(options?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Product[]; total: number }> {
    const { search, page = 1, limit = 10 } = options || {};

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.where(
        'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { items, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // First check if product exists
    await this.findOne(id);

    // Use transaction for update
    return this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Product, id, updateProductDto);
        return await this.findOne(id); // Fetch fresh data after update
      },
    );
  }

  async remove(id: string): Promise<{ success: boolean }> {
    // First check if product exists
    await this.findOne(id);

    await this.productRepository.delete(id);
    return { success: true };
  }

  async incrementView(id: string): Promise<Product> {
    return this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Product)
          .set({ viewCount: () => 'view_count + 1' })
          .where('id = :id', { id })
          .execute();

        return await this.findOne(id);
      },
    );
  }

  async incrementLike(id: string): Promise<Product> {
    return this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Product)
          .set({ likeCount: () => 'like_count + 1' })
          .where('id = :id', { id })
          .execute();

        return await this.findOne(id);
      },
    );
  }

  async incrementShare(id: string): Promise<Product> {
    return this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Product)
          .set({ shareCount: () => 'share_count + 1' })
          .where('id = :id', { id })
          .execute();

        return await this.findOne(id);
      },
    );
  }

  async search(query: string, limit = 10): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.name LIKE :query OR product.description LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('product.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }
}
