import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Gender, IUserRequest, IUserResponse, UserStatus } from "../models";
import { ITokenUser } from "../models/inerfaces/tokenUser";
import { IToResponseBase } from "./abstractions/to-response-base";
import { AccountEntityBase } from "./base-entities/account-entity-base";

@Entity('User')
export class User extends AccountEntityBase implements IToResponseBase<User, IUserResponse> {

    @Column({ unique: true, type: 'text' })
    userName!: string;

    @Column({ type: 'text', unique: true })
    email!: string;

    @Column({ type: 'text', nullable: true})
    passwordHash?: string;

    @Column({ type: 'text' })
    firstName!: string;

    @Column({ type: 'text', nullable: true })
    middleName?: string;

    @Column({ type: 'text' })
    lastName!: string;

    @Column({type: 'text', default: Gender.Others, nullable: false})
    gender!: Gender;

    @Column({ type: 'text', nullable: true })
    pictureUrl?: string;

    @Column({ type: 'timestamp', nullable: true })
    dateOfBirth?: Date;

    @Column({ type: 'int', default: UserStatus.Offline })
    status!: UserStatus;

    @Column({ type: 'timestamp', nullable: true})
    lastLogin?: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastOnline?: Date;

    @Column({type: 'text', nullable: false})
    role!: 'Admin' | 'User'

    toResponse(entity?: User): IUserResponse {

        if(!entity) entity = this;

        return {
            ...super.toAccountResponseBase(entity),
            userName: entity.userName,
            email: entity.email,
            firstName: entity.firstName,
            middleName: entity.middleName,
            lastName: entity.lastName,
            pictureUrl: entity.pictureUrl,
            dateOfBirth: entity.dateOfBirth,
            gender: entity.gender,
            status: entity.status,
            lastLogin: entity.lastLogin,
            lastOnline: entity.lastOnline,
            role: entity.role,
        }    
    }

    
    toEntity = (requestEntity: IUserRequest, id?: string, contextUser?: ITokenUser): User => {
        this.userName = requestEntity.userName;
        this.email = requestEntity.email;
        this.firstName = requestEntity.firstName;
        this.middleName = requestEntity.middleName;
        this.lastName = requestEntity.lastName;
        this.dateOfBirth = requestEntity.dateOfBirth;
        this.role = requestEntity.role;
        this.pictureUrl = requestEntity.pictureUrl;
        this.gender = requestEntity.gender;

        if(contextUser) super.toAccountEntity(contextUser, id);            

        return this;
    }

}