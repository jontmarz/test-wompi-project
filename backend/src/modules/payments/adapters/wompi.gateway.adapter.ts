import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaymentGateway, PaymentRequest, PaymentResponse } from '../../../domain/ports/payment.gateway';
import { Result, ok, err } from '../../../domain/entities/result';

@Injectable()
export class WompiGatewayAdapter implements PaymentGateway {
  private readonly baseUrl: string;
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = 'https://sandbox.wompi.co/v1';
    this.privateKey = this.configService.get('WOMPI_PRIVATE_KEY');
    this.publicKey = this.configService.get('WOMPI_PUBLIC_KEY');
  }

  async processPayment(request: PaymentRequest): Promise<Result<PaymentResponse, string>> {
    try {
      // Primero tokenizar la tarjeta
      const tokenResult = await this.tokenizeCard(request);
      if (tokenResult.isError()) {
        return err(tokenResult.getError());
      }

      const token = tokenResult.getValue();

      // Crear transacción
      const transactionData = {
        amount_in_cents: request.amount * 100,
        currency: request.currency,
        customer_email: request.customerData.email,
        payment_method: {
          type: 'CARD',
          token: token,
          installments: 1,
        },
        reference: `ref_${Date.now()}`,
        customer_data: {
          full_name: request.customerData.name,
          phone_number: request.customerData.phone,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        transactionData,
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const transaction = response.data.data;

      return ok({
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount_in_cents / 100,
        currency: transaction.currency,
        paymentMethod: 'CARD',
      });
    } catch (error) {
      return err('Error al procesar el pago con Wompi');
    }
  }

  async getPaymentStatus(id: string): Promise<Result<PaymentResponse, string>> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`,
          },
        },
      );

      const transaction = response.data.data;

      return ok({
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount_in_cents / 100,
        currency: transaction.currency,
        paymentMethod: 'CARD',
      });
    } catch (error) {
      return err('Error al obtener estado del pago');
    }
  }

  private async tokenizeCard(request: PaymentRequest): Promise<Result<string, string>> {
    try {
      const cardData = {
        number: request.cardNumber,
        cvc: request.cvv,
        exp_month: request.expiryDate.split('/')[0],
        exp_year: `20${request.expiryDate.split('/')[1]}`,
        card_holder: request.customerData.name,
      };

      const response = await axios.post(
        `${this.baseUrl}/tokens/cards`,
        cardData,
        {
          headers: {
            'Authorization': `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return ok(response.data.data.id);
    } catch (error) {
      return err('Error al tokenizar la tarjeta');
    }
  }
}