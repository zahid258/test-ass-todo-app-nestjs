import { Module } from '@nestjs/common';
import { AccountService } from './account-service';
import { UserService } from './user-service';
import { ToDoService } from './todo-service';
import { RepositoryModule } from 'src/dal';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TodosGateway } from 'src/socket-gateway/todos.gateway';

@Module({
    imports: [RepositoryModule, JwtModule],
    providers: [AccountService, UserService, ToDoService, JwtService, TodosGateway],
    exports: [AccountService, UserService, ToDoService]
})
export class ServiceModule {}
