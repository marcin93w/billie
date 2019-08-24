import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddDebtCommand } from './domain/add-debt.command';
import { Debt, DebtType } from './domain/debt.model';

@Controller()
export class DebtsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  async addDebtGet(): Promise<string> {
    await this.commandBus.execute(new AddDebtCommand('a', 'b', new Debt(DebtType.LENT_PAYOFF, 12, '', new Date())));
    return 'ok';
  }
}
