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

  function simulateLedgerReloading() {
    const serialized = JSON.stringify(ledger);
    const deserializedLedger = DebtsLedger.deserialize(JSON.parse(serialized));
    ledger = deserializedLedger;
  }

  describe('adding debt by host', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));
      simulateLedgerReloading();

      expect(ledger.getDebts().length).toBe(1);
      expect(ledger.getDebts()[0]).toStrictEqual(debt);
      expect(ledger.getBalance()).toBe(-debt.getAmount());
    });
  });

  describe('adding debt by guest', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));
      simulateLedgerReloading();
      ledger.addDebt(new AddDebtCommand('guest', threadId, debt));

      expect(ledger.getDebts().length).toBe(2);
      expect(ledger.getDebts()[1].getType()).toBe(DebtType.LENT);
      expect(ledger.getBalance()).toBe(0);
    });
  });

  describe('adding debt and payoff', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt));

      simulateLedgerReloading();
      const debt1 = new Debt(DebtType.BORROWED_PAYOFF, 12, '', new Date());
      ledger.addDebt(new AddDebtCommand(hostUserId, threadId, debt1));

      expect(ledger.getThreadId()).toBe(threadId);
      expect(ledger.getDebts().length).toBe(2);
      expect(ledger.getDebts()[1]).toBe(debt1);
      expect(ledger.getBalance()).toBe(0);
    });
  });
});
