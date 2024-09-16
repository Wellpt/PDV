import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
    async onModuleInit() {
        await this.$connect(); // consta ao banco de dados o modulo de inicialização
    }
    async onModuleDestroy() {
        await this.$disconnect(); // desconecta do banco de dados quando o modulo é destruido
    }

    async enableShutdownHooks(app: INestApplication) {
       app.enableShutdownHooks();
    }

}