import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:5174', // URL вашего фронтенда
        credentials: true, // Для поддержки cookies и авторизационных заголовков
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
