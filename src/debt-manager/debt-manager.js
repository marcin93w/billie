"use strict";
const debtTypes = require("./debt-types");
const logger = require("../utils/logger");
class DebtManager {
    constructor(debtsRepository, debtBalancesRepository, threadsRepository, usersRepository) {
        this.debtsRepository = debtsRepository;
        this.debtBalancesRepository = debtBalancesRepository;
        this.threadsRepository = threadsRepository;
        this.usersRepository = usersRepository;
    }
    addDebt(userId, threadInfo, debtType, amount) {
        logger.trace('adding new debt', { userId, threadInfo, debtType, amount });
        return this.findThreadContact(userId, threadInfo)
            .then(contact => {
            if (contact) {
                logger.trace('saving debt for contact', contact);
                return this.saveDebt(userId, threadInfo.id, contact.id, debtType, amount, new Date(), false, false);
            }
            else {
                logger.trace('saving unaccepted debt');
                return this.debtsRepository.addPending({
                    id: null,
                    userId,
                    threadId: threadInfo.id,
                    debtType,
                    amount,
                    date: new Date(),
                    isCanceled: false
                });
            }
        });
    }
    saveDebt(userId, threadId, contactId, debtType, amount, date, isCanceled, canceledByCreator) {
        return this.debtsRepository.add({
            id: null,
            user1: userId,
            user2: contactId,
            threadId,
            debtType,
            amount,
            date,
            isCanceled,
            canceledByCreator
        })
            .then(debtId => {
            if (isCanceled) {
                return Promise.resolve(debtId);
            }
            return this.debtBalancesRepository.updateDebt(userId, contactId, this.toRelativeAmount(debtType, amount))
                .then(() => debtId);
        });
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
        logger.trace('finding thread contact');
        return this.threadsRepository.getUserThreadsByThreadId(threadInfo.id)
            .then(threads => {
            const userThread = threads.find(t => t.userId === userId);
            const contactThread = threads.find(t => t.userId !== userId);
            const contactId = contactThread && contactThread.userId;
            if (userThread) {
                logger.trace('User thread found', { userThread, contactThread });
                return Promise.resolve(contactId);
            }
            logger.trace('Adding user thread');
            return this.threadsRepository.addUserThread({
                userId,
                threadId: threadInfo.id,
                isGroup: threadInfo.type === 'GROUP'
            })
                .then(() => {
                if (!contactThread) {
                    logger.trace('No contact in thread already');
                    return null;
                }
                logger.trace('Found contact for thread, accepting pending debts', contactThread);
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
            logger.trace('accepting debt', d);
            return this.saveDebt(d.userId, threadId, userId, d.debtType, d.amount, d.date, d.isCanceled, true)
                .then(() => this.debtsRepository.removePendingDebtById(d.id));
        })));
    }
    removeDebt(id, userId) {
        logger.trace('removing debt', { id, userId });
        return this.debtsRepository.get(id)
            .then(debt => {
            if (debt.user1 !== userId) {
                return Promise.reject('Unauthorized');
            }
            else {
                return this.debtsRepository.remove(id)
                    .then(() => this.debtBalancesRepository.updateDebt(userId, debt.user2, -this.toRelativeAmount(debt.debtType, debt.amount)));
            }
        });
    }
    removePendingDebt(id, userId) {
        logger.trace('removing pending debt', { id, userId });
        return this.debtsRepository.getPending(id)
            .then(debt => {
            if (debt.userId !== userId) {
                return Promise.reject('Unauthorized');
            }
            else {
                return this.debtsRepository.removePendingDebtById(id);
            }
        });
    }
    cancelPendingDebt(id, userId) {
        logger.trace('canceling pending debt', { id, userId });
        return this.debtsRepository.getPending(id)
            .then(debt => {
            if (debt.userId !== userId) {
                return Promise.reject('Unauthorized');
            }
            else {
                return this.debtsRepository.cancelPendingDebtById(id);
            }
        });
    }
    cancelDebt(id, userId) {
        logger.trace('canceling debt', { id, userId });
        return this.debtsRepository.get(id)
            .then(debt => {
            if (debt.user1 !== userId || debt.user2 !== userId) {
                return Promise.reject('Unauthorized');
            }
            else {
                return this.debtsRepository.cancelDebtById(id, debt.user1 === userId)
                    .then(() => this.debtBalancesRepository.updateDebt(userId, debt.user2, -this.toRelativeAmount(debt.debtType, debt.amount)));
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
        logger.trace('Showing debts history', { userId, contactId });
        return this.debtsRepository.getDebts(userId, contactId)
            .then(debts => debts.map(debt => ({
            amount: debt.amount,
            date: debt.date,
            debtType: calculateDebtType(debt.debtType, debt.whichUser),
            isCanceled: debt.isCanceled,
            userCanceled: debt.whichUser === 1 ? debt.canceledByCreator : !debt.canceledByCreator
        })));
    }
    getUserBalances(userId) {
        logger.trace('showing user balances', { userId });
        return Promise.all([
            this.debtBalancesRepository.getUserBalances(userId),
            this.debtsRepository.getPendingDebtsBalancesForUser(userId)
        ])
            .then(results => ({
            contacts: results[0],
            unaccpeted: results[1]
        }));
    }
    getTotalBalance(userId) {
        logger.trace('calculating total balance', { userId });
        return this.debtBalancesRepository.getUserBalances(userId)
            .then(balances => balances
            .map(s => s.amount)
            .reduce((sum, cur) => sum + cur, 0));
    }
    getThreadContext(userId, threadInfo) {
        logger.trace('finding thread context', { userId, threadInfo });
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
    getPendingDebtsForThread(userId, threadId) {
        logger.trace('showing pending debts for thread', { userId, threadId });
        return this.debtsRepository.getPendingDebtsByThreadId(threadId);
    }
}
;
module.exports = DebtManager;
//# sourceMappingURL=debt-manager.js.map