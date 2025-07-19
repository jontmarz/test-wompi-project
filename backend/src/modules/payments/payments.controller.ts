import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear transacción de pago' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const result = await this.paymentsService.createPayment(createPaymentDto);
    
    if (result.isError()) {
      return {
        success: false,
        message: result.getError(),
        data: null,
      };
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Obtener estado de transacción' })
  async getStatus(@Param('id') id: string) {
    const result = await this.paymentsService.getPaymentStatus(id);
    
    if (result.isError()) {
      return {
        success: false,
        message: result.getError(),
        data: null,
      };
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }
}