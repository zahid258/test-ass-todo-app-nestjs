import { Gender, UserStatus } from "../../enums";
import { IAccountResponse } from "./account";
import { IResponseBase } from "./response-base";

export interface IUserResponse extends IResponseBase {
    userName: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: Date;
    status: UserStatus;
    gender: Gender;
    lastLogin?: Date;
    lastOnline?: Date;
    role: 'Admin' | 'User';
    pictureUrl?: string;
    accountId?: string;
    account?: IAccountResponse;
}