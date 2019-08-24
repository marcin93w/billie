import { AddDebtCommand } from './add-debt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsLedgerRepository } from '../infrastructure/debts-ledger-repository.service';
import { DebtsLedger } from './debts-ledger.model';

@CommandHandler(AddDebtCommand)
export class AddDebtHandler implements ICommandHandler<AddDebtCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AddDebtCommand): Promise<any> {
    const debtsLedger = this.debtsLedgerRepository.find(command.senderUserId, command.receiverUserId) ||
      new DebtsLedger(command.senderUserId, command.receiverUserId);

    debtsLedger.addDebt(command);

    this.debtsLedgerRepository.save(debtsLedger);
  }
}
