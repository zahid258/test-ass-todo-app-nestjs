import { IAccountResponse } from "./account";

export interface IResponseBase {
    id: string;
    createdAt: Date;
    active: boolean;
    createdBy: string;
    createdById: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    modifiedById?: string;
}

export interface IAccountResponseBase extends IResponseBase {
    accountId: string;
    account?: IAccountResponse;
}