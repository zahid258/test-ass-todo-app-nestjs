import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IToDoRequest, IToDoResponse, ITokenUser, TaskStatus } from "../models";
import { IToResponseBase } from "./abstractions/to-response-base";
import { AccountEntityBase } from "./base-entities/account-entity-base";
import { User } from "./user";

@Entity('ToDo')
export class ToDo extends AccountEntityBase implements IToResponseBase<ToDo, IToDoResponse> {
    
    @Column({ type: 'text'})
    todo!: string;

    @Column({ type: 'text'})
    details!: string;

    @Column({ type: 'timestamp'})
    dueDate!: Date;

    @Column({ type: 'text'})
    status!: TaskStatus;

    @Column({nullable: true})
    userId?: string;

    @ManyToOne(() => User, (user) => user, {nullable: true})
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user!: User
    
    toResponse(entity?: ToDo): IToDoResponse {
       
        if(!entity) entity = this;

        return {
            ...super.toAccountResponseBase(entity),
            todo: entity.todo,
            details: entity.details,
            status: entity.status,
            dueDate: entity.dueDate,
            userId: entity.userId,
            user: entity.user ? entity.user.toResponse(entity.user): undefined
        }
    }

    toEntity = (entityRequest: IToDoRequest, id?: string, contextUser?: ITokenUser): ToDo => {
        this.todo = entityRequest.todo;
        this.details = entityRequest.details;
        this.dueDate = entityRequest.dueDate;
        this.userId = entityRequest.userId;
        this.status = entityRequest.status ?? 'PENDING';

        if(entityRequest.userId){
            let user = new User();
            user.id = entityRequest.userId;
            this.user = user;
        }

        if(contextUser) super.toAccountEntity(contextUser, id);
        
        return this;
    }
}