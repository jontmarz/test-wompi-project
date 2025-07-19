import { Product } from '../../infrastructure/database/entities/product.entity';
import { Result } from '../entities/result';

export interface ProductRepository {
  findAll(): Promise<Result<Product[], string>>;
  findById(id: string): Promise<Result<Product, string>>;
  updateStock(id: string, quantity: number): Promise<Result<void, string>>;
}