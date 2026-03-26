import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Viral-Shop API - Integración')
    .setDescription('Documentación para la gestión de órdenes en MariaDB y Google Sheets')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`\n🚀 Servidor listo en: http://localhost:3000`);
  console.log(`📝 Swagger disponible en: http://localhost:3000/api\n`);
}
bootstrap();