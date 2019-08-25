import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from '../debts/contracts/add-debt.command';
import { Debt } from '../debts/contracts/debt.model';
import { AddDebtDto } from './add-debt-dto.type';
import { ApiRequest } from './api-request.type';
import { AcceptLedgerCommand } from '../debts/contracts/accept-ledger.command';

@Controller('api')
export class ApiController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('add-debt')
  async addDebt(@Req() request: ApiRequest, @Body() dto: AddDebtDto): Promise<void> {
    await this.commandBus.execute(new AddDebtCommand(request.user.id, request.threadId, new Debt(dto.type, dto.amount, dto.comment, new Date())));
  }

  @Get('accept-debt')
  async acceptDebt(@Req() request: ApiRequest): Promise<void> {
    await this.commandBus.execute(new AcceptLedgerCommand(request.user.id, request.threadId));
  }
}
