import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, // Variavel de ambiente do banco de dados
        }
      }
    })
  }
  async onModuleInit() {
    await this.$connect(); // Conectar ao banco de dados quando o módulo for inicializado
  }

  async enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
 }
}