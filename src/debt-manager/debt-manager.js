"use strict";
const debtTypes = require("./debt-types");
class DebtManager {
    constructor(debtsRepository, debtBalancesRepository, threadsRepository, usersRepository) {
        this.debtsRepository = debtsRepository;
        this.debtBalancesRepository = debtBalancesRepository;
        this.threadsRepository = threadsRepository;
        this.usersRepository = usersRepository;
    }
    addDebt(userId, threadInfo, debtType, amount) {
        return this.findThreadContact(userId, threadInfo)
            .then(contact => {
            if (contact) {
                return this.saveDebt(userId, threadInfo.id, contact.id, debtType, amount);
            }
            else {
                return this.debtsRepository.addPending({
                    id: null,
                    userId,
                    threadId: threadInfo.id,
                    debtType,
                    amount,
                    date: new Date()
                });
            }
        });
    }
    saveDebt(userId, threadId, contactId, debtType, amount) {
        return this.debtsRepository.add({
            id: null,
            user1: userId,
            user2: contactId,
            threadId,
            debtType,
            amount,
            date: new Date()
        })
            .then(() => this.debtBalancesRepository.updateDebt(userId, contactId, this.toRelativeAmount(debtType, amount)));
    }
    toRelativeAmount(debtType, amount) {
        if (debtType === debtTypes.LENT || debtType === debtTypes.BORROWED_PAYOFF) {
            return amount;
        }
        else {
            return -amount;
        }
    }
    findThreadContact(userId, threadInfo) {
        return this.threadsRepository.getUserThreadsByThreadId(threadInfo.id)
            .then(threads => {
            const userThread = threads.find(t => t.userId === userId);
            const contactThread = threads.find(t => t.userId !== userId);
            const contactId = contactThread && contactThread.userId;
            if (userThread) {
                return Promise.resolve(contactId);
            }
            return this.threadsRepository.addUserThread({
                userId,
                threadId: threadInfo.id,
                isGroup: threadInfo.type === 'GROUP'
            })
                .then(() => {
                if (!contactThread) {
                    return null;
                }
                return this.acceptPendingDebts(userId, threadInfo.id)
                    .then(() => contactId);
            });
        })
            .then(contactId => {
            if (contactId) {
                return this.usersRepository.getById(contactId);
            }
            return Promise.resolve(null);
        });
    }
    acceptPendingDebts(userId, threadId) {
        return this.debtsRepository.getPendingDebtsByThreadId(threadId)
            .then(debts => Promise.all(debts.map(d => {
            return this.saveDebt(d.userId, threadId, userId, d.debtType, d.amount)
                .then(() => this.debtsRepository.removePendingDebtById(d.id));
        })));
    }
    cancelDebt(id, userId) {
        return this.debtsRepository.get(id)
            .then(debt => {
            if (debt.user1 !== userId) {
                return Promise.reject('Unauthorized');
            }
            else {
                return this.debtsRepository.remove(id)
                    .then(_ => {
                    if (debt.user2) {
                        return this.debtBalancesRepository.updateDebt(userId, debt.user2, -this.toRelativeAmount(debt.debtType, debt.amount));
                    }
                    return Promise.resolve();
                });
            }
        });
    }
    getDebtsHistory(userId, contactId) {
        function calculateDebtType(debtType, whichUser) {
            if (whichUser === 1) {
                return debtType;
            }
            switch (debtType) {
                case debtTypes.BORROWED: return debtTypes.LENT;
                case debtTypes.LENT: return debtTypes.BORROWED;
                case debtTypes.BORROWED_PAYOFF: return debtTypes.LENT_PAYOFF;
                case debtTypes.LENT_PAYOFF: return debtTypes.BORROWED_PAYOFF;
            }
        }
        return this.debtsRepository.getDebts(userId, contactId)
            .then(debts => debts.map(debt => ({
            amount: debt.amount,
            date: debt.date,
            debtType: calculateDebtType(debt.debtType, debt.whichUser)
        })));
    }
    getUserBalances(userId) {
        return this.debtBalancesRepository.getUserBalances(userId);
    }
    getTotalBalance(userId) {
        return this.debtBalancesRepository.getUserBalances(userId)
            .then(balances => balances
            .map(s => s.amount)
            .reduce((sum, cur) => sum + cur, 0));
    }
    getThreadContext(userId, threadInfo) {
        return this.findThreadContact(userId, threadInfo)
            .then(contact => {
            if (!contact) {
                return this.debtsRepository.getThreadPendingDebtsBalance(threadInfo.id)
                    .then(balance => ({ contact: null, threadBalance: balance ? (balance.amount || 0) : 0 }));
            }
            return this.debtBalancesRepository.getUsersBalance(userId, contact.id)
                .then(balance => ({ contact, threadBalance: balance ? (balance.amount || 0) : 0 }));
        });
    }
    getPendingDebtsForThread(userId, threadInfo) {
        return this.debtsRepository.getPendingDebtsByThreadId(threadInfo.id);
    }
}
;
module.exports = DebtManager;
//# sourceMappingURL=debt-manager.js.map