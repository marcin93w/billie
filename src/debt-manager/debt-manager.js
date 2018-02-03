const debtTypes = require('./debt-types.js'),
    _ = require('lodash');

class DebtManager {
    constructor(debtRepository) {
        this.debtRepository = debtRepository
    }
    
    addDebt (userId, threadId, contact, debtType, amount) {
        return this.debtRepository.add({ user1: userId, user2: contact && contact.id, threadId, debtType, amount, date: new Date()})
    }

    cancelDebt (id, userId) {
        return this.debtRepository.remove(id, userId)
    }

    acceptDebt (threadId, userId) {
        return this.debtRepository.updateSecondUserByThreadId(threadId, userId)
    }

    getDebt(id) {
        return this.debtRepository.get(id)
    }

    getUserDebts (userId) {
        return this.debtRepository.getUserDebts(userId)
            .then(debts => debts.map(debt => ({
                user: debt.user,
                threadId: debt.threadId,
                amount: toRelativeAmount(debt.debtType, debt.amount, debt.isUser1),
                date: debt.date,
                userName: debt.fullName
            })))
    }

    getDebtStatus (userId) {
        return this.getUserDebts(userId)
            .then(userDebts => {
                const status = _.groupBy(userDebts, 'user')

                return _.flatMap(Object.keys(status), key => {
                    if (key !== 'null') {
                        return {
                            userId: key,
                            amount: status[key].map(d => d.amount).reduce((sum, cur) => sum + cur),
                            date: null,
                            threadId: null,
                            userName: status[key][0].userName
                        }
                    } else {
                        return status[key].map(d => ({
                            userId: null,
                            amount: d.amount,
                            date: d.date,
                            threadId: d.threadId,
                            userName: null
                        }))
                    }
                })
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

function toRelativeAmount(debtType, amount, isUser1) {
    if (debtType === debtTypes.LENT || debtType === debtTypes.BORROWED_PAYOFF) {
        return isUser1 ? amount : -amount
    } else {
        return isUser1 ? -amount : amount
    }
}

module.exports = DebtManager;