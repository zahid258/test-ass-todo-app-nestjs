import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Injectable } from '@nestjs/common';
import { ToDoService } from "../../bl";
import { IFetchRequest, IGetSingleRecordFilter, IToDoRequest, TaskStatus } from "../../models";
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('todos')
@UseGuards(JwtAuthGuard) 
export class ToDoController {
    constructor(private readonly toDoService: ToDoService) {}

    @Post()
    async add(@Body() toDoRequest: IToDoRequest, @CurrentUser() user) {
        return await this.toDoService.add(toDoRequest, user);
    }

    @Post('get-all')
    async getAll(@Body() fetchRequest: IFetchRequest<IToDoRequest> | undefined, @CurrentUser() user) {
        return await this.toDoService.get(user, fetchRequest);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user) {
        return await this.toDoService.getById(id, user);
    }

    @Post('query')
    async getOneByQuery(
        @Body() filter: IGetSingleRecordFilter<IToDoRequest>,
        @CurrentUser() user
    ) {
        return await this.toDoService.getOne(user, filter);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @CurrentUser() user) {
        return await this.toDoService.delete(id, user);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() toDoRequest: IToDoRequest,
        @CurrentUser() user
    ) {
        return await this.toDoService.update(id, toDoRequest, user);
    }

    @Put('status-update')
    async complete(@Body() payload: {id: string, status: TaskStatus}, @CurrentUser() user) {
        return await this.toDoService.partialUpdate(payload.id, { status: payload.status }, user);
    }

}