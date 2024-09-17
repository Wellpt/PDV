import { Module } from '@nestjs/common';
import { ProductService } from 'src/Services/product.service';
import { ProductController } from 'src/Controllers/product.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService, PrismaService],
    exports: [ProductService]
})
export class ProductModule {}