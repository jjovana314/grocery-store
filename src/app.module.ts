import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';
import { GroceryModule } from './grocery/grocery.module';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';
import { LoggerModule } from 'nestjs-pino';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    GroceryModule,
    SeedModule,
    AuthModule,
    MongooseModule.forRoot(config.get().DATABASE_URL),
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        serializers: {
          timestamp: () => {
            `time: ${new Date(Date.now()).toISOString()}`;
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: `dd.mm.yyyy, HH:MM:ss`,
            ignore: 'pid,hostname',
          },
        },
        autoLogging: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, RolesGuard, AuthGuard],
})
export class AppModule { }
