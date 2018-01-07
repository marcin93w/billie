const 
    test = require('ava'),
    DebtManager = require('../src/debt-manager/debt-manager');

const senderPsid = 'asd'
const testContactName = 'testContact';

// test('should calculate debt balance correctly', async t => {
//     await debtManager.addDebt(senderPsid, testContactName, 4);
//     await debtManager.addDebt(senderPsid, testContactName, 6);
//     await debtManager.addDebt(senderPsid, 'asd', 6);
//     await debtManager.addDebt(testContactName, senderPsid, 7);
//     await debtManager.addDebt('gfdgvd', senderPsid, 5);

// 	t.true(debtManager.getBalance(senderPsid, testContactName) === 3);
// });

class RepositoryMock {
    constructor() {
        this.debts = []
        this.updates = []
    }
    add(debt) {
        this.debts.push(debt)
        return 0
    }
    update(id, params) {
        this.updates[id] = params
        return true
    }
    get (id) {
        return this.debts[id]
    }
}

test('should accept debt when sending different userid', t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)
    const id = debtManager.addDebt('1', '1', 0, 10)
    debtManager.acceptDebt(id, '2')

    t.true(repositoryMock.updates[0].user2 === '2')
});

test('should not accept debt when sending same userid', t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)
    const id = debtManager.addDebt('1', '1', 0, 10)
    debtManager.acceptDebt(id, '1')

    t.true(repositoryMock.updates.length === 0)
});