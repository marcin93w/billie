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
        return Promise.resolve(this.debts.length - 1)
    }
    updateSecondUser(id, userId) {
        this.updates[id] = userId
        Object.assign(this.debts[id], {user2: userId})
        return Promise.resolve()
    }
    remove(id) {
        this.debts[id] = null
    }
    get (id) {
        return Promise.resolve(this.debts[id])
    }
    getAll() {
        return Promise.resolve(this.debts)
    }
}

test('should accept debt when sending different userid', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)
    const id = await debtManager.addDebt('1', '1', 0, 10)
    await debtManager.acceptDebt(id, '2')

    t.true(repositoryMock.updates[0] === '2')
});

test('should not accept debt when sending same userid', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)
    const id = await debtManager.addDebt('1', '1', 0, 10)
    await debtManager.acceptDebt(id, '1')

    t.true(repositoryMock.updates.length === 0)
});

test('should calculate debt status correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 4)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt ('2', 1, debtTypes.LENT, 6)
    await debtManager.acceptDebt(id, senderPsid)
    id = await debtManager.addDebt (senderPsid, 1, debtTypes.LENT, 7)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED_PAYOFF, 3)
    await debtManager.acceptDebt(id, '5')

    const status = await debtManager.getDebtStatus(senderPsid)

    t.is(status.find(s => s.name === '2').amount, 3)
})

test('should calculate debt total balance correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 4)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt ('2', 1, debtTypes.LENT, 6)
    await debtManager.acceptDebt(id, senderPsid)
    id = await debtManager.addDebt (senderPsid, 1, debtTypes.LENT, 7)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 3)
    await debtManager.acceptDebt(id, '5')

    const totalBalance = await debtManager.getDebtTotalBalance(senderPsid)

    t.true(totalBalance === 6)
})

test('should calculate thread debt balance correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, debtTypes.BORROWED, 4)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt ('2', 1, debtTypes.LENT, 6)
    await debtManager.acceptDebt(id, senderPsid)
    id = await debtManager.addDebt (senderPsid, 1, debtTypes.LENT, 7)
    await debtManager.acceptDebt(id, '2')
    id = await debtManager.addDebt (senderPsid, 2, debtTypes.BORROWED, 3)
    await debtManager.acceptDebt(id, '5')

    const threadBalance = await debtManager.getThreadBalance(senderPsid, 1)

    t.true(threadBalance === 3)
})
