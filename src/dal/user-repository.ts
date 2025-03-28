import { Injectable } from "@nestjs/common";
import { User } from "../entities";
import { IUserResponse } from "../models";
import { GenericRepository } from "./generics/repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository extends GenericRepository<User,IUserResponse> {
    constructor(@InjectRepository(User) userRepository: Repository<User>){
        super(userRepository);
    }

}