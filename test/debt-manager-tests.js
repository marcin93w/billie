const 
    test = require('ava'),
    debtTypes = require('../src/debt-manager/debt-types'),
    DebtManager = require('../src/debt-manager/debt-manager');

const senderPsid = 'asd'
const testContactName = 'testContact';

class RepositoryMock {
    constructor() {
        this.debts = []
        this.updates = []
    }
    add(debt) {
        this.debts.push(debt)
        return this.debts.length - 1
    }
    update(id, params) {
        this.updates[id] = params
        Object.assign(this.debts[id], params)
        return true
    }
    get (id) {
        return this.debts[id]
    }
    getAll() {
        return this.debts
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

test('should calculate debt status correctly', t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 4)
    debtManager.acceptDebt(id, '2')
    id = debtManager.addDebt ('2', 1, debtTypes.LENT, 6)
    debtManager.acceptDebt(id, senderPsid)
    id = debtManager.addDebt (senderPsid, 1, debtTypes.LENT, 7)
    debtManager.acceptDebt(id, '2')
    id = debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED_PAYOFF, 3)
    debtManager.acceptDebt(id, '5')

    const status = debtManager.getDebtStatus(senderPsid)

    t.true(status['2'] === 3)
})

test('should calculate debt total balance correctly', t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 4)
    debtManager.acceptDebt(id, '2')
    id = debtManager.addDebt ('2', 1, debtTypes.LENT, 6)
    debtManager.acceptDebt(id, senderPsid)
    id = debtManager.addDebt (senderPsid, 1, debtTypes.LENT, 7)
    debtManager.acceptDebt(id, '2')
    id = debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 3)
    debtManager.acceptDebt(id, '5')

    const totalBalance = debtManager.getDebtTotalBalance(senderPsid)

    t.true(totalBalance === 6)
})
