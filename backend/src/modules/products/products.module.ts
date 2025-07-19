import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
// import { ProductRepositoryAdapter } from './adapters/product.repository.adapter';
import { Product } from '../../infrastructure/database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    // {
    //   provide: 'ProductRepository',
    //   useClass: ProductRepositoryAdapter,
    // },
  ],
  exports: [
    ProductsService,
    // 'ProductRepository',
  ],
})
export class ProductsModule {}