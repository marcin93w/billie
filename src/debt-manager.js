var debts = [];

module.exports = {
    addDebt: (owner, debtor, amount) => {
        console.log(`Debt from ${owner} to ${debtor} of amount ${amount} added`);
        debts.push({owner, debtor, amount});
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