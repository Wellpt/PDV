import { ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
        return this.prisma.product.create({ data })
    }

    async getProducts(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }
    async getProductById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {
                id: id,
            },
        });
    }

    async getProductByName(name: string): Promise<Product> {
        return this.prisma.product.findFirst({
            where: { name: name },
        });
    }

    async updateProduct(id: number, updateData: { name?: string; price?: number; description?: string; stock?: number }): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data: updateData, // Atualiza apenas os campos fornecidos
        });
    }
    
}