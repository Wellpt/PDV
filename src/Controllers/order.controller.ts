// import { Controller, Get, Post, Body, Param, Logger, Query, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { OrderService } from 'src/Services/order.service';
// import { Order } from '@prisma/client';


// @ApiTags('orders')
// @Controller('orders')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) { }
  
//   @UseGuards(JwtAuthGuard) // protegendo com JWT
//   @Post()
//   @ApiOperation({ summary: 'Cria um novo pedido'})
//   async createOrder(
//     @Body('productId') productId: number,
//     @Body('quantity') quantity: number,
//     @Body('status') status: string
//   ): Promise < { message: string} > {
//     const order = await this.orderService.createOrder(productId, quantity, status);
//     const product = await this.orderService.getProductById(productId);
//     Logger.log(`Pedido criado com: ${productId} quantidade de: ${quantity} e com status: ${status}`);

//     return { message: 
//       `Pedido concluido, estoque atualizado para o produto 
//       ${product.name}, o pedido esta com status: 
//       ${order.status}, estoque atual 
//       ${product.stock}` 
//     };
//   }

//   @Get()
//   @ApiOperation({ 
//     summary: 'Retorna todos os pedidos ou filtrado por periodo, dia, semana, e mes.'})
//   async getOrders(
//     @Query('dataInicio') dataInicio?: string,
//     @Query('dataFinal') dataFinal?: string,
//     @Query('periodo') periodo?: 'dia' | 'semana' | 'mes'
//   ): Promise < { orders: Order[], totalBalance: number } > {
//     return this.orderService.getOrders(dataInicio, dataFinal, periodo);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Retorna um pedido pelo ID'})
//   async getOrderById(@Param('id') id: string): Promise < Order > {
//     const numericId = parseInt(id, 10); // Converte a string 'id' para número
//     return this.orderService.getOrderById(numericId);
//   }
// }


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
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
    @Body('status') status: string
  ): Promise<{ message: string }> {
    try {
      const order = await this.orderService.createOrder(productId, quantity, status);
      const product = await this.orderService.getProductById(productId);
      Logger.log(`Pedido criado com: ${productId} quantidade de: ${quantity} e com status: ${status}`);

      return {
        message: `Pedido concluído, estoque atualizado para o produto ${product.name}, o pedido está com status: ${order.status}, estoque atual ${product.stock}`
      };
    } catch (error) {
      Logger.error('Erro ao criar pedido', error);
      throw new Error('Erro ao criar pedido.');
    }
  }

  @UseGuards(JwtAuthGuard) // Protegendo com JWT
  @Get()
  @ApiOperation({ summary: 'Retorna todos os pedidos ou filtrado por periodo, dia, semana e mês.' })
  async getOrders(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFinal') dataFinal?: string,
    @Query('periodo') periodo?: 'dia' | 'semana' | 'mes'
  ): Promise<{ orders: Order[], totalBalance: number }> {
    try {
      return this.orderService.getOrders(dataInicio, dataFinal, periodo);
    } catch (error) {
      Logger.error('Erro ao buscar pedidos', error);
      throw new Error('Erro ao buscar pedidos.');
    }
  }

  @UseGuards(JwtAuthGuard) // Protegendo com JWT
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pedido pelo ID' })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    try {
      const numericId = parseInt(id, 10); // Converte a string 'id' para número
      return this.orderService.getOrderById(numericId);
    } catch (error) {
      Logger.error('Erro ao buscar pedido pelo ID', error);
      throw new Error('Erro ao buscar pedido pelo ID.');
    }
  }
}
