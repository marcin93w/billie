import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { User } from '../users/user.type';

export interface UserLedgersItemDto {
  fullName: string;
  balance: number;
  gender: string;
  avatarUrl: string;
  threadId: string;
}

@Injectable()
export class GetUserLedgersQuery {
  constructor(private readonly db: DatabaseService) {}

  async fetch(user: User): Promise<UserLedgersItemDto[]> {
    const hostingLedgers = await this.db.debtsLedgers.find({ hostUserId: user.id }).toArray();
    const guestLedgers = await this.db.debtsLedgers.find({ guestUserId: user.id }).toArray();

    const userDebtLedgers: UserLedgersItemDto[] = [];

    for (const ledger of hostingLedgers) {
      if (!ledger.guestUserId) {
        userDebtLedgers.push({
          balance: ledger.balance,
          threadId: ledger.threadId,
          fullName: '',
          gender: '',
          avatarUrl: '',
        });
      } else {
        const ledgerGuest = await this.db.users.findOne({ id: ledger.guestUserId });
        userDebtLedgers.push({
          ...ledgerGuest,
          balance: ledger.balance,
          threadId: ledger.threadId,
        });
      }
    }

    for (const ledger of guestLedgers) {
      const hostUser = await this.db.users.findOne({ id: ledger.hostUserId });
      userDebtLedgers.push({
        ...hostUser,
        balance: -ledger.balance,
        threadId: ledger.threadId,
      });
    }

    return userDebtLedgers;
  }
}
