import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from "../../bl";
import { IAccountRequest, IFetchRequest, IFilter, ITokenUser, RelationLoad } from "../../models";
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    async addAccount(@Body() accountRequest: IAccountRequest) {
        return await this.accountService.addNewAccount(accountRequest);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(@CurrentUser() user: ITokenUser, @Body() fetchRequest: IFetchRequest<IAccountRequest> | undefined) {
      
        return await this.accountService.get(user, fetchRequest);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getById(@CurrentUser() user: ITokenUser,@Param('id') id: string) {
        return await this.accountService.getById(id, user);
    }

    @Post('query')
    @UseGuards(JwtAuthGuard)
    async getOneByQuery(
        @Body() body: {
            filters: Array<IFilter<IAccountRequest, keyof IAccountRequest>>,
            relations?: RelationLoad<IAccountRequest>
        },
        @CurrentUser() user: ITokenUser,
    ) {
        return await this.accountService.getOne(user, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@CurrentUser() user: ITokenUser, @Param('id') id: string, @Req() req: Request) {
        return await this.accountService.delete(id, user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() accountRequest: IAccountRequest,
        @CurrentUser() user: ITokenUser,
    ) {
        return await this.accountService.update(id, accountRequest, user);
    }
}