import { Injectable } from "@nestjs/common";
import { ToDo } from "../entities";
import { IToDoRequest, IToDoResponse, ITokenUser } from "../models";
import { Service } from "./generics";
import { ToDoRepository } from "src/dal/todo-repository";
import { TodosGateway } from "src/socket-gateway/todos.gateway";

@Injectable()
export class ToDoService extends Service<ToDo, IToDoResponse, IToDoRequest> {
    constructor( private readonly toDoRepository: ToDoRepository, private readonly todoGateWay: TodosGateway) {
        super(toDoRepository, () => new ToDo)
    }
    public override async add(entityRequest: IToDoRequest, contextUser: ITokenUser): Promise<IToDoResponse> {
        let result = await super.add(entityRequest, contextUser);
        if(result.userId) this.todoGateWay.emitTodoCreated(result, result.userId)
        return result
    }

    public override async partialUpdate(id: string, partialEntity: Partial<IToDoRequest>, contextUser: ITokenUser): Promise<IToDoResponse> {
        let result = await super.partialUpdate(id,partialEntity, contextUser);
        if(result.userId) this.todoGateWay.emitTodoUpdated(result, result.userId, contextUser.id)
        return result;
    }

    public override async delete(id: string, contextUser: ITokenUser): Promise<void> {
        let byId = await super.getById(id, contextUser);
        let result = await super.delete(id, contextUser);
        if(byId?.userId) this.todoGateWay.emitTodoDeleted(id, byId.userId, contextUser.id)
        return result
    }

    
}
