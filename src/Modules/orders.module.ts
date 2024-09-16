import { Module } from '@nestjs/common';
import { OrderService } from 'src/Services/order.service';
import { OrderController } from 'src/Controllers/order.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from './product.module';

@Module({
    imports: [ProductModule],
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
})

export class OrderModule {}