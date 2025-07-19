import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentService } from '../../domain/services/payment.service';
import { WompiGatewayAdapter } from './adapters/wompi.gateway.adapter';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentService,
    {
      provide: 'PaymentGateway',
      useClass: WompiGatewayAdapter,
    },
  ],
})
export class PaymentsModule {}