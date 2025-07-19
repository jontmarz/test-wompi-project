import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../infrastructure/database/entities/product.entity';
import { ProductRepository } from '../../../domain/ports/product.repository';
import { Result, ok, err } from '../../../domain/entities/result';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Result<Product[], string>> {
    try {
      const products = await this.productRepository.find();
      return ok(products);
    } catch (error) {
      return err('Error al obtener productos');
    }
  }

  async findById(id: string): Promise<Result<Product, string>> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        return err('Producto no encontrado');
      }
      return ok(product);
    } catch (error) {
      return err('Error al obtener producto');
    }
  }

  async updateStock(id: string, quantity: number): Promise<Result<void, string>> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        return err('Producto no encontrado');
      }

      product.stock = Math.max(0, product.stock + quantity);
      await this.productRepository.save(product);
      return ok(undefined);
    } catch (error) {
      return err('Error al actualizar stock');
    }
  }
}