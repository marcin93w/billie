import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from '../debts/contracts/add-debt.command';
import { Debt } from '../debts/contracts/debt.model';
import { AddDebtDto } from './add-debt-dto.type';
import { ApiRequest } from './api-request.type';
import { AcceptLedgerCommand } from '../debts/contracts/accept-ledger.command';
import { GetLedgerQuery, LedgerDto } from '../queries/get-ledger.query';
import { GetUserLedgersQuery, UserLedgersItemDto } from '../queries/get-user-ledgers.query';

@Controller('api')
export class ApiController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly getLedgerQuery: GetLedgerQuery,
    private readonly getUserLedgersQuery: GetUserLedgersQuery,
  ) {}

  @Post('add-debt')
  async addDebt(@Req() request: ApiRequest, @Body() dto: AddDebtDto): Promise<void> {
    await this.commandBus.execute(new AddDebtCommand(request.user.id, request.threadId, new Debt(dto.type, dto.amount, dto.comment, new Date())));
  }

  @Put('accept-debt')
  async acceptDebt(@Req() request: ApiRequest): Promise<void> {
    await this.commandBus.execute(new AcceptLedgerCommand(request.user.id, request.threadId));
  }

  @Get('ledger')
  async getCurrentLedger(@Req() request: ApiRequest): Promise<LedgerDto> {
    return await this.getLedgerQuery.fetch(request.threadId, request.user);
  }

  @Get('ledger/:threadId')
  async getLedger(@Req() request: ApiRequest, @Param() params): Promise<LedgerDto> {
    return await this.getLedgerQuery.fetch(params.threadId, request.user);
  }

  @Get('ledgers')
  async getUserLedgers(@Req() request: ApiRequest): Promise<UserLedgersItemDto[]> {
    return await this.getUserLedgersQuery.fetch(request.user);
  }
}
