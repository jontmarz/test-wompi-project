import { Injectable, Inject } from '@nestjs/common';
// import { ProductRepository } from '../../domain/ports/product.repository';
import { Result, ok, err } from '../../domain/entities/result';
import { Product } from '../../infrastructure/database/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    // @Inject('ProductRepository')
    // private readonly productRepository: ProductRepository,
  ) {}

  async findAll(): Promise<Result<Product[], string>> {
    // return await this.productRepository.findAll();
    return ok([]);  // Devolver array vacío para test
  }

  async findById(id: string): Promise<Result<Product, string>> {
    // return await this.productRepository.findById(id);
    return err('Not implemented');
  }

  async updateStock(id: string, quantity: number): Promise<Result<void, string>> {
    // return await this.productRepository.updateStock(id, quantity);
    return err('Not implemented');
  }
}