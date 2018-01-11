const debtTypes = require('./debt-types.js'),
    _ = require('lodash');

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

        if (debt.user1 !== userId) {
            if(!this.debtRepository.update(id, { user2: userId })) {
                throw new Error(`Debt with id ${id} not accepted`);
            }
        }

        return debt;
    }

    getDebtStatus (user) {
        function toRelativeAmount(debtType, amount) {
            if (debtType === debtTypes.BORROWED || debtType === debtTypes.LENT_PAYOFF) {
                return amount
            } else {
                return -amount
            }
        }

        const debts = this.debtRepository.getAll()
        const debtsCreatedByUser = debts
            .filter(d => d.user1 === user)
            .map(d => ({
                user: d.user2,
                amount: toRelativeAmount(d.debtType, d.amount)
            }))
        const debtsCreatedForUser = debts
            .filter(d => d.user2 === user)
            .map(d => ({
                user: d.user1,
                amount: -toRelativeAmount(d.debtType, d.amount)
            }))

        const userDebts = debtsCreatedByUser.concat(debtsCreatedForUser)

        return _.mapValues(_.groupBy(userDebts, 'user'),
            debts => debts.map(d => d.amount).reduce((sum, cur) => sum += cur))
    }

    getDebtTotalBalance(user) {
        return Object.values(this.getDebtStatus(user))
            .reduce((sum, cur) => sum += cur)
    }
};

module.exports = DebtManager;