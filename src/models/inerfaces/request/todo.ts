import { TaskStatus } from "../../../models";

export interface IToDoRequest {
    todo: string;
    details: string;
    userId?: string;
    dueDate: Date;
    status: TaskStatus;
}