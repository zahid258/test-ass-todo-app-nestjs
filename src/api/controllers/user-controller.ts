import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Injectable } from '@nestjs/common';
import { UserService } from "../../bl";
import { IFetchRequest, IGetSingleRecordFilter, IUserRequest } from "../../models";
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Injectable()
@Controller('users')
@UseGuards(JwtAuthGuard) // Applied at the controller level to protect all endpoints
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async add(@Body() userRequest: IUserRequest, @CurrentUser() user) {
        return await this.userService.add(userRequest, user);
    }

    @Post('get-all')
    async getAll(@Body() fetchRequest: IFetchRequest<IUserRequest> | undefined, @CurrentUser() user) {
        return await this.userService.get(user, fetchRequest);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user) {
        return await this.userService.getById(id, user);
    }

    @Post('query')
    async getOneByQuery(
        @Body() filter: IGetSingleRecordFilter<IUserRequest>,
        @CurrentUser() user
    ) {
        return await this.userService.getOne(user, filter);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @CurrentUser() user) {
        return await this.userService.delete(id, user);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() userRequest: IUserRequest,
        @CurrentUser() user
    ) { 
        return await this.userService.update(id, userRequest, user);
    }
}