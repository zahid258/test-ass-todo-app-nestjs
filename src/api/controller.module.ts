import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account-controller'
import { UserController } from './controllers/user-controller';
import { AuthController } from './controllers/auth-controller';
import { ToDoController } from './controllers/todo-controller';
import { ServiceModule } from 'src/bl/service.module';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [ServiceModule, JwtModule,ConfigModule],
    controllers: [AccountController, UserController, AuthController, ToDoController, ],
    providers: [JwtAuthGuard, ConfigService],
    exports: [JwtAuthGuard]
})
export class ControllerModule {}
