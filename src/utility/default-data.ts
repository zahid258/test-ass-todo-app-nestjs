import { DataSource } from "typeorm";
import { Account, User } from "../entities";
import { randomUUID } from "crypto";
import { EmptyGuid } from "../constants";
import { encrypt } from "./bcrypt-utility";
import { Modules } from "../constants/modules";
import { toCamelCase } from "./string-utility";
import { log } from "console";
import { Gender } from "../models";

export const AddDefaultData = async (dataSource: DataSource) => {

    let accountRepo = dataSource.getRepository(Account);
    let userRepo = dataSource.getRepository(User);
    
    let accountCount = await accountRepo.count();

    let account: Account = new Account().toEntity({
        name: "Default",
        phoneNo: "000000000000",
        email: "default@aaepa.com",
        address: "N/A",
        temporaryAddress: "   ",
        zipCode: 0,
        country: "USA",
        state: "California",
        city: "California"
    }, undefined,{name: "Admin", id: EmptyGuid, accountId:''});
    account.id = randomUUID();


    let user: User = new User().toEntity(
      {
        userName: "defaultAdmin",
        email: "default@aaepa.com",
        firstName: "Admin",
        middleName: undefined,
        gender: Gender.Male,
        lastName: "User",
        dateOfBirth: new Date(),
        password: "asdf@123",
        role: 'Admin',
      }, undefined,
      { name: "Admin", id: EmptyGuid, accountId: EmptyGuid }
    );

    user.passwordHash = await encrypt("asdf@123");


    if(!accountCount){
        await accountRepo.insert(account);
        await userRepo.insert({...user,account: account});
    }

}

