import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Product, Order } from '@prisma/client';
import * as dayjs from 'dayjs'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para criar o pedido e atualizar o estoque
  async createOrder(productId: number, quantity: number, status: string): Promise<Order> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado.`);
    }

    // Criar o pedido
    const order = await this.prisma.order.create({
      data: {
        productId,
        quantity,
        totalPrice: product.price * quantity,
        status,
        createdAt: new Date(),
      },
    });

    // Atualizar o estoque
    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity },
    });

    return order;
  }

  // Método para buscar o produto pelo ID
  async getProductById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  // Método para obter pedidos e o balanço total
  async getOrders(
    dataInicio?: string,
    dataFinal?: string,
    periodo ?: 'dia' | 'semana' | 'mes'
  ): Promise<{ orders: Order[], totalBalance: number }> {

    // Se o 'period' for fornecido, definir startDate e endDate automaticamente
    if (periodo) {
      const today = dayjs();

      switch (periodo) {
        case 'dia':
          dataInicio = today.startOf('day').toISOString();
          dataFinal = today.endOf('day').toISOString()
          break;
        case 'semana':
          dataInicio = today.startOf('week').toISOString();
          dataFinal = today.endOf('week').toISOString()
          break;
        case 'mes':
          dataInicio = today.startOf('month').toISOString();
          dataFinal = today.endOf('month').toISOString()
          break;
      }
    }

    // filtrar os pedidos com base no intervalo de datas, se fornecido
    const filters: any = {};
    if (dataInicio && dataFinal) {
      filters.createdAt = {
        gte: new Date(dataInicio),
        lte: new Date(dataFinal)
      };
    }
    const orders = await this.prisma.order.findMany({
      where: filters,
        include: {
            product: true, // Inclui o produto relacionado para pegar o preço unitario
        },
    });

    // Calcula o balanço total e formata os pedidos
    const formattedOrders = orders.map(order => ({
        id: order.id,
        productId: order.productId,
        unitPrice: order.product.price, // Adiciona o preço diretamente
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
    }));

    const totalBalance = formattedOrders.reduce((acumulador, order) => acumulador + order.totalPrice, 0);

    return { orders: formattedOrders, totalBalance };
}

  // Método para buscar pedido pelo ID
  async getOrderById(id: number): Promise<any> {
    const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
            product: {
                select: { price: true } // Apenas o campo price
            },
        },
    });

    if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    // Retorna a ordem com o preço unitário diretamente
    return {
        id: order.id,
        productId: order.productId,
        unitPrice: order.product.price, // Preço diretamente na ordem
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
    };
}
}
