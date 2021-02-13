import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from '../debts/contracts/add-debt.command';
import { AddDebtDto } from '../debts/contracts/add-debt-dto.type';
import { ApiRequest } from './api-request.type';
import { InitializeLedgerCommand } from '../debts/contracts/initialize-ledger.command';
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
    return await this.commandBus.execute(new AddDebtCommand(request.user.id, request.threadId, dto));
  }

  @Get('ledger')
  async getCurrentLedger(@Req() request: ApiRequest): Promise<LedgerDto> {
    const ledger = await this.getLedgerQuery.fetch(request.threadId, request.user);
    if (ledger) {
      return ledger
    }

    await this.commandBus.execute(new InitializeLedgerCommand(request.user.id, request.threadId));
    
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
