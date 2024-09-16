import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Product, Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para criar o pedido e atualizar o estoque
  async createOrder(productId: number, quantity: number): Promise<Order> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      throw new Error(`Produto com ID ${productId} não encontrado.`);
    }

    // Criar o pedido
    const order = await this.prisma.order.create({
      data: {
        productId,
        quantity,
        totalPrice: product.price * quantity,
        status: 'COMPLETED',
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
  async getOrders(): Promise<{ orders: any[], totalBalance: number }> {
    const orders = await this.prisma.order.findMany({
        include: {
            product: {
                select: { price: true } // Apenas o campo price
            },
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

    const totalBalance = formattedOrders.reduce((acc, order) => acc + order.totalPrice, 0);

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
