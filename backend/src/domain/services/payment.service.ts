import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentRequest } from '../ports/payment.gateway';
import { ProductRepository } from '../ports/product.repository';
import { Result, ok, err } from '../entities/result';
import { Transaction, TransactionStatus } from '../../infrastructure/database/entities/transaction.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly productRepository: ProductRepository,
  ) {}

  async processPayment(request: PaymentRequest, cartItems: any[]): Promise<Result<Transaction, string>> {
    // Validar stock
    const stockValidation = await this.validateStock(cartItems);
    if (stockValidation.isError()) {
      return err(stockValidation.getError());
    }

    // Procesar pago
    const paymentResult = await this.paymentGateway.processPayment(request);
    if (paymentResult.isError()) {
      return err(paymentResult.getError());
    }

    const paymentResponse = paymentResult.getValue();
    
    // Crear transacción
    const transaction = new Transaction();
    transaction.status = this.mapPaymentStatus(paymentResponse.status);
    transaction.amount = paymentResponse.amount;
    transaction.currency = paymentResponse.currency;
    transaction.paymentMethod = paymentResponse.paymentMethod;
    transaction.wompiTransactionId = paymentResponse.id;
    transaction.cartItems = cartItems;

    // Decrementar stock si el pago fue exitoso
    if (transaction.status === TransactionStatus.APPROVED) {
      await this.decrementStock(cartItems);
    }

    return ok(transaction);
  }

  private async validateStock(cartItems: any[]): Promise<Result<void, string>> {
    for (const item of cartItems) {
      const productResult = await this.productRepository.findById(item.productId);
      if (productResult.isError()) {
        return err(`Producto ${item.productId} no encontrado`);
      }

      const product = productResult.getValue();
      if (product.stock < item.quantity) {
        return err(`Stock insuficiente para ${product.name}`);
      }
    }

    return ok(undefined);
  }

  private async decrementStock(cartItems: any[]): Promise<void> {
    for (const item of cartItems) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }
  }

  private mapPaymentStatus(status: string): TransactionStatus {
    switch (status.toLowerCase()) {
      case 'approved':
        return TransactionStatus.APPROVED;
      case 'declined':
        return TransactionStatus.DECLINED;
      case 'voided':
        return TransactionStatus.VOIDED;
      default:
        return TransactionStatus.PENDING;
    }
  }
}