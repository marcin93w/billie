const debtTypes = require('./debt-types.js'),
    debtRepository = require('../repository/debts-repository.js');

class DebtManager {
    constructor(debtRepository) {
        this.debtRepository = debtRepository
    }
    
    addDebt (userId, threadId, debtType, amount) {
        return this.debtRepository.add({ user1: userId, threadId, debtType, amount });
    }

    acceptDebt (id, userId) {
        const debt = this.debtRepository.get(id)
        if (!debt) {
            throw new Error(`Debt with id ${id} does not exist`);
        }

        if (debt.user1 === userId) {
            return;
        }

        if(!this.debtRepository.update(id, { user2: userId })) {
            throw new Error(`Debt with id ${id} not accepted`);
        }
    }

    // getBalance(personId, contact) {
    //     const lentMoney = debts
    //         .filter(d => d.owner === personId && d.debtor === contact)
    //         .map(debt => debt.amount)
    //         .reduce((sum, cur) => sum += cur);
    //     const borrowedMoney = debts
    //         .filter(d => d.owner === contact && d.debtor === personId)
    //         .map(debt => debt.amount)
    //         .reduce((sum, cur) => sum += cur);

    //     return lentMoney - borrowedMoney;
    // }
};

module.exports = DebtManager;