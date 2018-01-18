const debtTypes = require('./debt-types.js'),
    _ = require('lodash');

class DebtManager {
    constructor(debtRepository) {
        this.debtRepository = debtRepository
    }
    
    addDebt (userId, threadId, debtType, amount) {
        return this.debtRepository.add({ user1: userId, threadId, debtType, amount, date: new Date()});
    }

    acceptDebt (id, userId) {
        return this.debtRepository.get(id)
            .then(debt => {
                if (!debt) {
                    throw new Error(`Debt with id ${id} does not exist`);
                }

                if (debt.user1 !== userId) {
                    debt.user2 = userId
                    return this.debtRepository.updateSecondUser(id, userId)
                        .then(_ => debt)
                }

                return debt
            })
    }

    getUserDebts (userId) {
        return this.debtRepository.getAll()
            .then(debts => {
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
            })
    }

    getDebtStatus (userId) {
        return this.getUserDebts(userId)
            .then(userDebts => {
                const status = _.mapValues(_.groupBy(userDebts, 'user'),
                    debts => debts.map(d => d.amount).reduce((sum, cur) => sum + cur))

                return Object.keys(status).map(key => ({
                    name: key === 'null' ? null : key,
                    amount: status[key]
                }))
            })
    }

    getDebtTotalBalance(userId) {
        return this.getDebtStatus(userId)
            .then(status => status
                .map(s => s.amount)
                .reduce((sum, cur) => sum + cur, 0))
    }

    getThreadBalance(userId, threadId) {
        return this.getUserDebts(userId)
            .then(userDebts => {
                const threadDebts = userDebts.filter(d => d.threadId === threadId)

                return threadDebts
                    .map(d => d.amount)
                    .reduce((sum, cur) => sum + cur, 0)
            })
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