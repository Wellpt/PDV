import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(app.get(JwtAuthGuard))

  // Configuração do Swagger
  const options = new DocumentBuilder()
    .setTitle('API de PDV')
    .setVersion('1.0')
    .setDescription('API para ponto de venda, com cadastro de produtos, pedidos e balando geral de pedidos')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // const db = process.env.DATABASE_URL
  const port = process.env.PORT || 3000;
  await app.listen(3000);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  console.log (`Banco de dados conectado com sucesso`)
  console.log(`Servidor rodando na porta ${port}`);
}

bootstrap();
