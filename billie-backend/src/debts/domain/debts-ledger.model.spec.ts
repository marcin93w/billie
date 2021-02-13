import { DebtType } from '../contracts/value-objects/debt-type';
import { Debt } from './debt.model';
import { DebtsLedger } from './debts-ledger.model';

describe('DebtsLedger', () => {
  let ledger: DebtsLedger;
  const threadId = 'threadId';
  const hostUserId = 'userId';

  beforeEach(async () => {
    ledger = new DebtsLedger(threadId, hostUserId);
  });

  function simulateLedgerReloading() {
    const serialized = JSON.stringify(ledger);
    const deserializedLedger = DebtsLedger.createFrom(JSON.parse(serialized));
    ledger = deserializedLedger;
  }

  describe('adding debt by host', () => {
    it('should be added and update balance', () => {

      const debt = new Debt(DebtType.BORROWED, 12, '', new Date());
      ledger.addDebt(hostUserId, debt.getType(), debt.getAmount(), debt.getComment());
      simulateLedgerReloading();

      expect(ledger.getDebts().length).toBe(1);
      expect(ledger.getDebts()[0]).toStrictEqual(debt);
      expect(ledger.getBalance()).toBe(-debt.getAmount());
    });
  });

  describe('adding debt by guest', () => {
    it('should be added and update balance', () => {

      ledger.addDebt(hostUserId, DebtType.BORROWED, 12, '');
      simulateLedgerReloading();
      ledger.addDebt('guest', DebtType.BORROWED, 12, '');

      expect(ledger.getDebts().length).toBe(2);
      expect(ledger.getDebts()[1].getType()).toBe(DebtType.LENT);
      expect(ledger.getBalance()).toBe(0);
    });
  });

  describe('adding debt and payoff', () => {
    it('should be added and update balance', () => {

      ledger.addDebt(hostUserId, DebtType.BORROWED, 12, '');

      simulateLedgerReloading();
      const debt1 = new Debt(DebtType.BORROWED_PAYOFF, 12, '', new Date());
      ledger.addDebt(hostUserId, debt1.getType(), debt1.getAmount(), debt1.getComment());

      expect(ledger.getThreadId()).toBe(threadId);
      expect(ledger.getDebts().length).toBe(2);
      expect(ledger.getDebts()[1]).toStrictEqual(debt1);
      expect(ledger.getBalance()).toBe(0);
    });
  });
});
