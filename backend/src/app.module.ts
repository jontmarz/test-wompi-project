import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
// import { PaymentsModule } from './modules/payments/payments.module';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ProductsModule,
    // PaymentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}