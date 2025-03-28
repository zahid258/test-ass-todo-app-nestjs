import { Injectable } from "@nestjs/common";
import { Account } from "../entities";
import { IAccountResponse } from "../models";
import { GenericRepository } from "./generics/repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository extends GenericRepository<Account, IAccountResponse> {
    constructor(@InjectRepository(Account) accountRepo: Repository<Account>){
        super(accountRepo);
    }


}