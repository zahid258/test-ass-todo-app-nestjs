import { Column, JoinColumn, ManyToOne } from "typeorm";
import { EntityBase } from "./entity-base";
import { Account } from "../account";
import { IAccountResponseBase } from "../../models/inerfaces/response/response-base";
import { ITokenUser } from "../../models";

export abstract class AccountEntityBase extends EntityBase {
  @Column({ nullable: false})
  accountId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "accountId", referencedColumnName: "id" })
  account?: Account;

  protected toAccountEntity( contextUser: ITokenUser, id?: string ): AccountEntityBase {
    this.accountId = contextUser.accountId;
    this.account = new Account();
    this.account.id = contextUser.accountId;
    super.toBaseEntiy(contextUser,id);

    return this;
  }

  protected toAccountResponseBase<T extends AccountEntityBase>( entity: T ): IAccountResponseBase {
    return {
      ...super.toResponseBase(entity),
      accountId: entity.accountId,
      account: entity.account ? entity.account.toResponse(): undefined
    };
  }
}
