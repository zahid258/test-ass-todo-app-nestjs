import { Module } from '@nestjs/common';
import { AccountRepository } from './account-repository';
import { UserRepository } from './user-repository';
import { ToDoRepository } from './todo-repository';
import { EntitiesModule } from 'src/entities/entities.module';

@Module({
    imports: [EntitiesModule],
    providers: [AccountRepository, UserRepository, ToDoRepository],
    exports: [AccountRepository, UserRepository, ToDoRepository],
})
export class RepositoryModule {}