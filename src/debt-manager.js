const debtTypes = require('./debt-types.js');

var debts = [];

module.exports = {
    addDebt: (userId, threadId, debtType, amount) => {
        const id = debts.length;
        debts.push({id, user1: userId, threadId, debtType, amount});
        return id;
    },
    acceptDebt: (id, userId) => {
        const debt = debts.find(d => d.id === id);
        if(!debt) {
            throw new Error(`Debt with id ${id} does not exist`);
        }

        debt.user2 = userId;
    },
    getBalance(personId, contact) {
        const lentMoney = debts
            .filter(d => d.owner === personId && d.debtor === contact)
            .map(debt => debt.amount)
            .reduce((sum, cur) => sum += cur);
        const borrowedMoney = debts
            .filter(d => d.owner === contact && d.debtor === personId)
            .map(debt => debt.amount)
            .reduce((sum, cur) => sum += cur);

        return lentMoney - borrowedMoney;
    }
};