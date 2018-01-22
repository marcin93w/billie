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
    updateSecondUserByThreadId(threadId, userId) {
        this.updates[threadId] = userId
        let debt = this.debts.find(d => d.threadId === threadId)
        if(debt) {
            Object.assign(debt, {user2: userId})
        }
        return Promise.resolve()
    }
    remove(id) {
        this.debts[id] = null
    }
    get (id) {
        return Promise.resolve(this.debts[id])
    }
    getUserDebts (userId) {
        const debtsCreatedByUser = this.debts
            .filter(d => d.user1 === userId)
            .map(d => ({
                user: d.user2,
                threadId: d.threadId,
                amount: d.amount,
                debtType: d.debtType,
                date: d.date
            }))
        const debtsCreatedForUser = this.debts
            .filter(d => d.user2 === userId)
            .map(d => ({
                user: d.user1,
                threadId: d.threadId,
                amount: d.amount,
                debtType: 1-d.debtType,
                date: d.date
            }))
        return Promise.resolve(debtsCreatedByUser.concat(debtsCreatedForUser))
    }
}

test('should accept debt when sending different userid', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)
    const id = await debtManager.addDebt('1', '1', 0, 10)
    await debtManager.acceptDebt(id, '2')

    t.true(repositoryMock.updates[0] === '2')
});

test('should calculate debt status correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.BORROWED, 4)
    id = await debtManager.addDebt ('2', 1, {id: senderPsid}, debtTypes.LENT, 6)
    id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.LENT, 7)
    id = await debtManager.addDebt (senderPsid, 1, {id: '5'}, debtTypes.LENT, 3)

    const status = await debtManager.getDebtStatus(senderPsid)

    t.is(status.find(s => s.name === '2').amount, 3)
})

test('should calculate debt total balance correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.BORROWED, 4)
    id = await debtManager.addDebt (2, 1, {id: senderPsid}, debtTypes.LENT, 6)
    id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.LENT, 7)
    id = await debtManager.addDebt (senderPsid, 1, {id: '5'}, debtTypes.BORROWED, 3)

    const totalBalance = await debtManager.getDebtTotalBalance(senderPsid)

    t.true(totalBalance === 6)
})

test('should calculate thread debt balance correctly', async t => {
    const repositoryMock = new RepositoryMock()
    const debtManager = new DebtManager(repositoryMock)

    let id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.BORROWED, 4)
    id = await debtManager.addDebt (2, 1, {id: senderPsid}, debtTypes.LENT, 6)
    id = await debtManager.addDebt (senderPsid, 1, {id: '2'}, debtTypes.LENT, 7)
    id = await debtManager.addDebt (senderPsid, 2, {id: '5'}, debtTypes.BORROWED, 3)

    const threadBalance = await debtManager.getThreadBalance(senderPsid, 1)

    t.true(threadBalance === 3)
})
