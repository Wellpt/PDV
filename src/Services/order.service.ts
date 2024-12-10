import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Product, Order } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para criar o pedido com múltiplos itens e atualizar o estoque
  async createOrder(products: { productName: string, quantity: number }[], status: string): Promise<{ totalPrice: number, status: string }> {
    let totalPrice = 0;

    // Verifica e calcula o preço total antes de criar o pedido
    const orderItems = await Promise.all(products.map(async (productInfo) => {
      const product = await this.prisma.product.findFirst({ where: { name: productInfo.productName } });

      if (!product) {
        throw new NotFoundException(`Produto com nome ${productInfo.productName} não encontrado.`);      
    }

    totalPrice += product.price * productInfo.quantity;

    return {
      productid: product.id,
      quantity: productInfo.quantity,
      unitPrice: product.price
    };
  }));

    // Criar o pedido com todos os itens
    const order = await this.prisma.order.create({
      data: {
        status,
        totalPrice,
        createdAt: new Date(),
        items: {
          create: orderItems.map(item => ({
            productId: item.productid,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true, 
      },
    });

    // Atualizar o estoque para cada produto
    await Promise.all(orderItems.map(async (item) => {
      await this.prisma.product.update({
        where: { id: item.productid },
        data: { stock: { decrement: item.quantity} }, // diminui o estoque do produto 
      });
    }));
  return { totalPrice, status };
}

  // Método para buscar o produto pelo Nome
  async getProductByName(name: string): Promise<Product> {
    return this.prisma.product.findFirst({ where: { name } });
  }

  // Método para obter pedidos e o balanço total
  async getOrders(
    dataInicio?: string,
    dataFinal?: string,
    periodo?: 'dia' | 'semana' | 'mes'
  ): Promise<{ orders: any[], totalBalance: number }> {
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
        items: {
          include: {
            product: true, // Inclui o produto relacionado
          },
        },
      },
    });

    // Calcula o balanço total e formata os pedidos
    const formattedOrders = orders.map(order => ({
      id: order.id,
      items: order.items.map(item => ({
        productName: item.product.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
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
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    // Retorna a ordem com o preço unitário diretamente
    return {
      id: order.id,
      items: order.items.map(item => ({
        productName: item.product.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
    })),
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt
    };
  }
  async deleteOrder(id: number): Promise<void> {
    try {
      await this.prisma.order.delete({ where: { id } });
      Logger.log(`Pedido com ID ${id} foi deletado do banco de dados`);
    } catch (error) {
      Logger.error('Erro ao deletar pedido', error.message);
      throw new Error('Erro ao deletar pedido.');
    }
  }
}