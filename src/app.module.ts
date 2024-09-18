import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductController } from './Controllers/product.controller';
import { ProductModule } from './Modules/product.module';
import { OrderController } from './Controllers/order.controller';
import { OrderModule } from './Modules/orders.module';
import { OrderService } from './Services/order.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserModule } from './Modules/user.module';

@Module({
  imports: [AuthModule, ProductModule, OrderModule, UserModule],
  controllers: [ProductController, OrderController],
  providers: [OrderService, PrismaService]
})
export class AppModule {}
