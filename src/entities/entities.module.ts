import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user";
import { ToDo } from "./to-do";
import { Account } from "./account";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ToDo, Account]),
        // Add other entities as needed
      ],
      exports: [TypeOrmModule]
})
export class EntitiesModule {}