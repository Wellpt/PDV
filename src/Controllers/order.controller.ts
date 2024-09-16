import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from 'src/Services/order.service';
import { Order } from '@prisma/client';


@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido'})
  async createOrder(
    @Body('productId') productId: number,
    @Body('quantity') quantity: number
  ): Promise < { message: string} > {
    const order = await this.orderService.createOrder(productId, quantity);
    const product = await this.orderService.getProductById(productId);
    Logger.log(`Pedido criado com: ${productId} quantidade de: ${quantity}`);

    return { message: `Pedido concluido, estoque atualizado para o produto ${product.name}, estoque atual ${product.stock}` };
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os pedidos'})
  async getOrders(): Promise < { orders: Order[], totalBalance: number } > {
    return this.orderService.getOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pedido pelo ID'})
  async getOrderById(@Param('id') id: string): Promise < Order > {
    const numericId = parseInt(id, 10); // Converte a string 'id' para número
    return this.orderService.getOrderById(numericId);
  }
}
