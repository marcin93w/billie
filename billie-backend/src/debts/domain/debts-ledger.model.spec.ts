import { DebtsLedger } from './debts-ledger.model';
import { AddDebtCommand } from './add-debt.command';
import { Debt, DebtType } from './debt.model';

describe('DebtsLedger', () => {
  let ledger: DebtsLedger;
  const threadId = 'threadId';
  const hostUserId = 'userId';

  beforeEach(async () => {
    ledger = new DebtsLedger(threadId, hostUserId);
  });

  describe('adding debt by host', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));

      expect(ledger.debts.length).toBe(1);
      expect(ledger.debts[0]).toBe(debt);
      expect(ledger.balance).toBe(-debt.amount);
    });
  });

  describe('adding debt by guest', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));
      ledger.addDebt(new AddDebtCommand('guest', threadId, debt));

      expect(ledger.debts.length).toBe(2);
      expect(ledger.debts[1].type).toBe(DebtType.LENT);
      expect(ledger.balance).toBe(0);
    });
  });

  describe('adding debt and payoff', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));
      const debt1 = new Debt(DebtType.BORROWED_PAYOFF, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt1));

      expect(ledger.debts.length).toBe(2);
      expect(ledger.debts[1]).toBe(debt1);
      expect(ledger.balance).toBe(0);
    });
  });
});
