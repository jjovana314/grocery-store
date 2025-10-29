import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { AuthController } from './auth.controller';

@Module({
    exports: [AuthService],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.register({
            secret: config.get().SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        })
    ],
    controllers: [AuthController]
})
export class AuthModule { }
