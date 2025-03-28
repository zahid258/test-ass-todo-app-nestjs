// src/app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ControllerModule } from './api/controller.module';
import { EntitiesModule } from './entities/entities.module';
import { RepositoryModule } from './dal';
import { ServiceModule } from './bl/service.module';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './middlewares/exception-handler';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    
    // PostgreSQL Configuration
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return configService.get('database.postgres') as TypeOrmModuleOptions;
      },
    }),
    ControllerModule,
    EntitiesModule,
    RepositoryModule,
    ServiceModule,
    LoggerModule,
    SocketGatewayModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}