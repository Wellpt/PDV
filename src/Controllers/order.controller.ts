import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Controller, Get, Post, Body, Param, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from 'src/Services/order.service';
import { Order } from '@prisma/client';


@ApiTags('orders')
@Controller('orders')
export class OrderController {
  @UseGuards(JwtAuthGuard) // protegendo com JWT
  @Get()
  findAll() {
    return "Essa rota esta protegida e requer um token JWT."
  }
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido'})
  async createOrder(
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
    @Body('status') status: string
  ): Promise < { message: string} > {
    const order = await this.orderService.createOrder(productId, quantity, status);
    const product = await this.orderService.getProductById(productId);
    Logger.log(`Pedido criado com: ${productId} quantidade de: ${quantity} e com status: ${status}`);

    return { message: 
      `Pedido concluido, estoque atualizado para o produto 
      ${product.name}, o pedido esta com status: 
      ${order.status}, estoque atual 
      ${product.stock}` 
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Retorna todos os pedidos ou filtrado por periodo, dia, semana, e mes.'})
  async getOrders(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFinal') dataFinal?: string,
    @Query('periodo') periodo?: 'dia' | 'semana' | 'mes'
  ): Promise < { orders: Order[], totalBalance: number } > {
    return this.orderService.getOrders(dataInicio, dataFinal, periodo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pedido pelo ID'})
  async getOrderById(@Param('id') id: string): Promise < Order > {
    const numericId = parseInt(id, 10); // Converte a string 'id' para número
    return this.orderService.getOrderById(numericId);
  }
}
