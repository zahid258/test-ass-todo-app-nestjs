import { AccountRepository, UserRepository } from "../dal";
import { Actions, FilterMatchModes, FilterOperators, ILoginRequest, ISignUpRequest, IUserRequest, IUserResponse } from "../models";
import { Account, User } from "../entities";
import { randomUUID } from "crypto";
import { compareHash, encrypt, signJwt } from "../utility";
import { Service } from "./generics";
import { EmptyGuid } from "../constants";
import { QueryRunner } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService extends Service<User, IUserResponse, IUserRequest>   {

    constructor(
         private readonly userRepository: UserRepository,
         private readonly accountRepository: AccountRepository,
         private readonly jwtService: JwtService,
    ) { 
        super(userRepository, () => new User)
    }
    
    async login(loginRequest: ILoginRequest): Promise<IUserResponse & {token: string}> {
        let user = await this.userRepository.getOneByQuery({filters:[{field: 'userName', value: loginRequest.userName, operator: FilterOperators.Or, matchMode: FilterMatchModes.Equal}, {field: 'email', value: loginRequest.userName, operator: FilterOperators.Or, matchMode: FilterMatchModes.Equal, ignoreCase: true}], relations: {account: true}});
        let error: any = {code: '401', message: 'Invalid username or password', name: 'Unauthorized'};
        
        if (!user) throw new NotFoundException('Invalid username or password',  error);
  
        let match = await compareHash(loginRequest.password, user.passwordHash ?? "");
        if (match) {
            await this.userRepository.partialUpdate(user.id, {lastLogin: new Date()});
            return {...user.toResponse(user), token: await this.jwtService.signAsync({id: user.id, name: `${user.firstName} ${user.lastName}`, accountId: user.accountId},{secret: process.env.JWT_SECRET})};
        }
        else {
            throw new Error('Invalid username or password',  error);
        }
    }
    


    async signUp(signUpRequest: ISignUpRequest): Promise<IUserResponse & {token: string}> {
        let user = (await this.createNewUserAccount(signUpRequest));
        let addedUser = await this.userRepository.invokeDbOperations(user, Actions.Add);
        let responseUser = addedUser.toResponse();
        responseUser.account = user.account?.toResponse();
        responseUser.role = user.role;;
        return {...responseUser, token: signJwt({id: responseUser.id, name: `${responseUser.firstName} ${responseUser.lastName}`, accountId: responseUser.accountId ?? ""})};
    }

    private async createNewUserAccount(userRequest: ISignUpRequest, isGoogle: boolean = false, queryRunner?: QueryRunner): Promise<User>{
        try{

            let account: Account = new Account().toEntity(
              {
                name: userRequest.userName,
                phoneNo: userRequest.phoneNum ?? "",
                email: userRequest.email,
                address: userRequest.address,
                temporaryAddress: userRequest.temporaryAddress,
                zipCode: userRequest.zipCode,
                country: userRequest.country,
                state: userRequest.state,
                city: userRequest.city,
              },
              undefined,
              { name: "system", id: EmptyGuid, accountId: "" }
            );
            account.id = randomUUID();

    
       
    
            await this.accountRepository.invokeDbOperations(account, Actions.Add);
    
            let user: User = new User().toEntity(
              {
                userName: userRequest.userName,
                email: userRequest.email,
                firstName: userRequest.firstName,
                middleName: userRequest.middleName,
                lastName: userRequest.lastName,
                dateOfBirth: userRequest.dateOfBirth,
                gender: userRequest.gender,
                password: userRequest.password,
                pictureUrl: userRequest.pictureUrl,
                role: 'Admin',
              },
              undefined,
              { name: "Admin", id: EmptyGuid, accountId: EmptyGuid }
            );
    
            user.role = 'Admin';
            user.account = account;
            user.role = 'Admin';
            user.accountId = account.id;
    
            if (userRequest.password)
              user.passwordHash = await encrypt(userRequest.password);
            return user;
        }catch(err){

            await this.repository.rollbackTransaction();
            throw err
        }
    }
}