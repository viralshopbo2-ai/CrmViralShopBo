import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guards/roles.guard';
import {JwtAuthGuard} from "./common/guards/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector),
  );

  const config = new DocumentBuilder()
    .setTitle('Viral-Shop API - Integración')
    .addBearerAuth()
    .setDescription(
      'Documentación para la gestión de órdenes en MariaDB y Google Sheets',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(` Servidor listo en: http://localhost:3000`);
  console.log(`Swagger disponible en: http://localhost:3000/api`);
}
bootstrap();