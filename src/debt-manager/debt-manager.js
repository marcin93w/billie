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

    getUserDebts (userId) {
        const debts = this.debtRepository.getAll()
        const debtsCreatedByUser = debts
            .filter(d => d.user1 === userId)
            .map(d => ({
                user: d.user2,
                threadId: d.threadId,
                amount: toRelativeAmount(d.debtType, d.amount)
            }))
        const debtsCreatedForUser = debts
            .filter(d => d.user2 === userId)
            .map(d => ({
                user: d.user1,
                threadId: d.threadId,
                amount: -toRelativeAmount(d.debtType, d.amount)
            }))

        return debtsCreatedByUser.concat(debtsCreatedForUser)
    }

    getDebtStatus (userId) {
        const userDebts = this.getUserDebts(userId)

        _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
            return key + value;
          });
        _.groupBy(userDebts, 'user')

        const status = _.mapValues(_.groupBy(userDebts, 'user'),
            debts => debts.map(d => d.amount).reduce((sum, cur) => sum += cur))

        return Object.keys(status).map(key => ({
            name: key,
            amount: status[key]
        }))
    }

    getDebtTotalBalance(userId) {
        return this.getDebtStatus(userId)
            .map(s => s.amount)
            .reduce((sum, cur) => sum += cur, 0)
    }

    getThreadBalance(userId, threadId) {
        const userDebts = this.getUserDebts(userId)
        const threadDebts = userDebts.filter(d => d.threadId === threadId)

        return threadDebts
            .map(d => d.amount)
            .reduce((sum, cur) => sum += cur, 0)
    }
}; 

function toRelativeAmount(debtType, amount) {
    if (debtType === debtTypes.BORROWED || debtType === debtTypes.LENT_PAYOFF) {
        return amount
    } else {
        return -amount
    }
}

module.exports = DebtManager;