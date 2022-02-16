import { ProductModule } from './modules/products/product.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
// MODULES

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      //host: process.env.DB_HOST,
      //database: process.env.DB_NAME,
      url: process.env.URL,
      entities: [join(__dirname, '**/entities/**.entity{.ts,.js}')],
      synchronize: true,
      logger: 'advanced-console',
      useUnifiedTopology: true
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    AppService
  ]
})
export class AppModule {}
