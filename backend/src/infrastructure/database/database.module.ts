import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Transaction } from './entities/transaction.entity';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Transaction, Customer]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}