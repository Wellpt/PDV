import { ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
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

    async updateProductStock(id: number, stock: number): Promise<Product> {
        return this.prisma.product.update({
            where: { id: id },
            data: { stock }
        });
    }
    
}