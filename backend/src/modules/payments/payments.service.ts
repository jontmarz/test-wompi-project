import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from '../../domain/services/payment.service';
import { Transaction } from '../../infrastructure/database/entities/transaction.entity';
import { Customer } from '../../infrastructure/database/entities/customer.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Result, ok, err } from '../../domain/entities/result';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly paymentService: PaymentService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Result<Transaction, string>> {
    try {
      // Crear o encontrar cliente
      let customer = await this.customerRepository.findOne({
        where: { email: createPaymentDto.customerData.email },
      });

      if (!customer) {
        customer = new Customer();
        customer.name = createPaymentDto.customerData.name;
        customer.email = createPaymentDto.customerData.email;
        customer.phone = createPaymentDto.customerData.phone;
        customer.shippingAddress = createPaymentDto.shippingAddress;
        customer = await this.customerRepository.save(customer);
      }

      // Procesar pago
      const paymentRequest = {
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        cardNumber: createPaymentDto.cardNumber,
        expiryDate: createPaymentDto.expiryDate,
        cvv: createPaymentDto.cvv,
        customerData: createPaymentDto.customerData,
      };

      const result = await this.paymentService.processPayment(
        paymentRequest,
        createPaymentDto.cartItems,
      );

      if (result.isError()) {
        return err(result.getError());
      }

      const transaction = result.getValue();
      transaction.customer = customer;
      
      const savedTransaction = await this.transactionRepository.save(transaction);
      return ok(savedTransaction);
    } catch (error) {
      return err('Error al procesar el pago');
    }
  }

  async getPaymentStatus(id: string): Promise<Result<Transaction, string>> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ['customer'],
      });

      if (!transaction) {
        return err('Transacción no encontrada');
      }

      return ok(transaction);
    } catch (error) {
      return err('Error al obtener estado de transacción');
    }
  }
}