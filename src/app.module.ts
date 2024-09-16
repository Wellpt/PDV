import { Module } from '@nestjs/common';
import { OrderModule } from './Modules/orders.module';
import { ProductModule } from './Modules/product.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
