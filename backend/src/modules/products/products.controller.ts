import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  async findAll() {
    const result = await this.productsService.findAll();
    
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.productsService.findById(id);
    
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