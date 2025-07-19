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
    // Datos de prueba temporales
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Smartphone Samsung Galaxy A54',
        description: 'Smartphone con pantalla AMOLED de 6.4", 128GB de almacenamiento, cámara principal de 50MP y batería de 5000mAh.',
        price: 850000,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        category: 'Smartphones',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Laptop HP Pavilion 15',
        description: 'Laptop con procesador Intel Core i5, 8GB RAM, 512GB SSD, pantalla de 15.6" Full HD y Windows 11.',
        price: 2200000,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        category: 'Computadoras',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Auriculares Sony WH-1000XM4',
        description: 'Auriculares inalámbricos con cancelación de ruido activa, hasta 30 horas de batería y sonido Hi-Res.',
        price: 650000,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        category: 'Audio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Tablet iPad Air',
        description: 'Tablet con chip M1, pantalla Liquid Retina de 10.9", 64GB de almacenamiento y compatibilidad con Apple Pencil.',
        price: 1800000,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        category: 'Tablets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        name: 'Monitor LG UltraWide 29"',
        description: 'Monitor ultrawide de 29" con resolución 2560x1080, panel IPS y conectividad USB-C.',
        price: 950000,
        stock: 6,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        category: 'Monitores',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    return ok(mockProducts);
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