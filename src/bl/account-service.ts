import { AccountRepository, UserRepository } from "../dal";
import { Actions, IAccountRequest, IAccountResponse, IUserRequest } from "../models";
import { Account, User } from "../entities";
import { randomUUID } from "crypto";
import { EmptyGuid } from "../constants/guid";
import { Service } from "./generics";
import { Injectable } from "@nestjs/common";
import { encrypt } from "src/utility";

@Injectable()
export class AccountService extends Service<Account, IAccountResponse, IAccountRequest>  {
    constructor( private readonly accountRepository: AccountRepository, private readonly userRepository: UserRepository){
        super(accountRepository, () => new Account)
    }
 
    async addNewAccount(entityRequest: IAccountRequest): Promise<IAccountResponse> {
        let account = new Account().toEntity(entityRequest);
        account.createdAt = new Date();
        account.active = true;
        account.deleted = false;
        account.createdById = EmptyGuid;
        account.createdBy = 'Admin';
        account.id = randomUUID();
        let transaction = await this.userRepository.beginTransaction();
        try{
            let response  = await this.accountRepository.invokeDbOperations(account, Actions.Add);
            if(entityRequest.defaultUser){
                let userRequest: IUserRequest = {
                    ...entityRequest.defaultUser,
                    dateOfBirth: new Date(),
                    role: 'Admin',
                    password: entityRequest.defaultUser.password
                }
                let user = new User().toEntity(userRequest);
                user.createdAt = new Date();
                user.active = true;
                user.deleted = false;
                user.createdById = EmptyGuid;
                user.passwordHash = await encrypt(userRequest.password as string)
                user.createdBy = 'Admin';
                user.id = randomUUID();
                user.accountId = response.id; 
                user.account = response;
                await this.userRepository.invokeDbOperations(user, Actions.Add);
            }
            await this.userRepository.commitTransaction();
            if (response) return response.toResponse();
            else throw new Error(`Error adding ${entityRequest}`); 
        }catch(err){
            await this.userRepository.rollbackTransaction();
            throw new Error(`Error adding ${err}`); 
        }
    }
}