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
    try {
    await this.$connect(); // Conectar ao banco de dados quando o módulo for inicializado
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados', error);
    throw new Error('Erro ao conectar ao banco de dados. Verifique as configurações e tente novamente.');
  }
}

  async enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
 }
}