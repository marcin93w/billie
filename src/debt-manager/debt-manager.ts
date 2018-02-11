import debtTypes = require('./debt-types')
import * as _ from 'lodash'
import DebtsRepository from '../repository/debts-repository'
import UsersRepository from '../repository/users-repository'
import DebtBalancesRepository from '../repository/debt-balances-repository'
import { User } from '../repository/types/entities'

class DebtManager {
    constructor(
        private debtsRepository: DebtsRepository, 
        private debtBalancesRepository: DebtBalancesRepository, 
        private threadsRepository, 
        private usersRepository: UsersRepository) {
    }
    
    addDebt (userId, threadInfo, debtType, amount) {
        return this.findThreadContact(userId, threadInfo)
            .then(contact => {
                if (contact) {
                    return this.saveDebt(userId, threadInfo.id, contact.id, debtType, amount)
                } else {
                    return this.debtsRepository.addPending({ 
                        id: null, 
                        userId, 
                        threadId: threadInfo.id, 
                        debtType, 
                        amount, 
                        date: new Date()})
                }
            })
    }
    
    private saveDebt (userId: string, threadId: string, contactId: string, debtType, amount) {
        return this.debtsRepository.add({ 
            id: null, 
            user1: userId, 
            user2: contactId, 
            threadId, 
            debtType, 
            amount, 
            date: new Date()})
        .then(() =>  this.debtBalancesRepository.updateDebt(userId, contactId, this.toRelativeAmount(debtType, amount)))
    }

    private toRelativeAmount(debtType, amount) {
        if (debtType === debtTypes.LENT || debtType === debtTypes.BORROWED_PAYOFF) {
            return amount
        } else {
            return -amount
        }
    }

    private findThreadContact(userId, threadInfo) : Promise<User> {
        return this.threadsRepository.getUserThreadsByThreadId(threadInfo.id)
            .then(threads => {
                const userThread = threads.find(t => t.userId === userId)
                const contactThread = threads.find(t => t.userId !== userId)
                const contactId = contactThread && contactThread.userId

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
                            return null
                        }
                        return this.acceptPendingDebts(userId, threadInfo.id)
                            .then(() => contactId)
                    })
            })
            .then(contactId => {
                if (contactId) {
                    return this.usersRepository.getById(contactId)
                }
                return Promise.resolve(null)
            })
    }

    private acceptPendingDebts(userId, threadId) {
        return this.debtsRepository.getPendingDebtsByThreadId(threadId)
            .then(debts => Promise.all(debts.map(d => {
                return this.saveDebt(d.userId, threadId, userId, d.debtType, d.amount)
                    .then(() => this.debtsRepository.removePendingDebtById(d.id))
            })))
    }

    cancelDebt (id, userId) {
        return this.debtsRepository.get(id)
            .then(debt => {
                if(debt.user1 !== userId) {
                    return Promise.reject('Unauthorized')
                } else {
                    return this.debtsRepository.remove(id)
                        .then(_ => {
                            if (debt.user2) {
                                return this.debtBalancesRepository.updateDebt(
                                    userId, debt.user2, -this.toRelativeAmount(debt.debtType, debt.amount))
                            }
                            return Promise.resolve()
                        })
                }
            })
    }

    getDebtsHistory (userId, contactId) {
        function calculateDebtType(debtType, whichUser) {
            if (whichUser === 1) {
                return debtType;
            }
            switch (debtType) {
                case debtTypes.BORROWED: return debtTypes.LENT
                case debtTypes.LENT: return debtTypes.BORROWED
                case debtTypes.BORROWED_PAYOFF: return debtTypes.LENT_PAYOFF
                case debtTypes.LENT_PAYOFF: return debtTypes.BORROWED_PAYOFF
            }
        }

        return this.debtsRepository.getDebts(userId, contactId)
            .then(debts =>
                debts.map(debt => ({
                    amount: debt.amount,
                    date: debt.date,
                    debtType: calculateDebtType(debt.debtType, debt.whichUser)
                }))
            );
    }

    getUserBalances (userId: string) {
        return this.debtBalancesRepository.getUserBalances(userId)
    }

    getTotalBalance(userId) {
        return this.debtBalancesRepository.getUserBalances(userId)
            .then(balances => balances
                .map(s => s.amount)
                .reduce((sum, cur) => sum + cur, 0))
    }

    getThreadContext(userId, threadInfo) {
        return this.findThreadContact(userId, threadInfo)
            .then(contact => {
                if (!contact) {
                    return this.debtsRepository.getThreadPendingDebtsBalance(threadInfo.id)
                        .then(balance => ({ contact: null, threadBalance: balance ? balance.amount : 0 }))
                }
                return this.debtBalancesRepository.getUsersBalance(userId, contact.id)
                    .then(threadBalance => ({ contact, threadBalance }))
            })
    }

    getThreadHistory(userId, threadInfo) {
        return this.getThreadContext(userId, threadInfo)
            .then(threadContext => {
                if(!threadContext.contact) {
                    return { ...threadContext, debtsHistory: null };
                }
                return this.getDebtsHistory(userId, threadContext.contact)
                    .then(debtsHistory => ({ ...threadContext, debtsHistory }))
            })
    }
}; 

export = DebtManager