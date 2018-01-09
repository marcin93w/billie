var debts = [];

module.exports = {
    add (debt) {
        debts.push(debt)
        return debts.length - 1
    },
    get (id) {
        return debts[id]
    },
    update (id, props) {
        const debt = debts[id]
        if (debt) {
            Object.assign(debt, props);
            return true;
        } else {
            return false;
        }
    },
    getAll () {
        return debts
    }
};