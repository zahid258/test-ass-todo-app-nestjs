import { Injectable } from "@nestjs/common";
import { ToDo } from "../entities";
import { IToDoResponse } from "../models";
import { GenericRepository } from "./generics/repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ToDoRepository extends GenericRepository<ToDo, IToDoResponse> {

    constructor (@InjectRepository(ToDo) todoRepository: Repository<ToDo>) {
        super(todoRepository);
    }
    
}