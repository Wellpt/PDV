import { UseGuards, Controller, Get, Post, Body, Param, Logger, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from 'src/Services/order.service';
import { Order } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard) // Protegendo com JWT
  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  async createOrder(
    @Body() body: { products: { productName: string, quantity: number }[], status: string } 
  ): Promise<{ message: string }> {
    try {

      const { products, status } = body;

      const order = await this.orderService.createOrder(products, status);
      Logger.log(`Pedido criado com: ${products.length} itens com status: ${status}`);

      return {
        message: `Pedido concluído com ${products.length} itens. Preço total: ${order.totalPrice}, Status: ${status}`
      };
    } catch (error) {
      Logger.error('Erro ao criar pedido', error.message);
      throw new Error('Erro ao criar pedido.');
    }
  }

  @UseGuards(JwtAuthGuard) // Protegendo com JWT
  @Get()
  @ApiOperation({ summary: 'Retorna todos os pedidos ou filtrado por período, dia, semana ou mês.' })
  async getOrders(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFinal') dataFinal?: string,
    @Query('periodo') periodo?: 'dia' | 'semana' | 'mes'
  ): Promise<{ orders: Order[], totalBalance: number }> {
    try {
      return await this.orderService.getOrders(dataInicio, dataFinal, periodo);
    } catch (error) {
      Logger.error('Erro ao buscar pedidos', error.message);
      throw new Error('Erro ao buscar pedidos.');
    }
  }

  @UseGuards(JwtAuthGuard) // Protegendo com JWT
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pedido pelo ID' })
  async getOrderById(@Param('id') id: string): Promise<any> {
    try {
      const numericId = parseInt(id, 10); // Converte a string 'id' para número
      return await this.orderService.getOrderById(numericId);
    } catch (error) {
      Logger.error('Erro ao buscar pedido pelo ID', error.message);
      throw new Error('Erro ao buscar pedido pelo ID.');
    }
  }
}
