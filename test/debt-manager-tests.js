const 
    test = require('ava'),
    debtManager = require('../src/debt-manager');

const senderPsid = 'asd'
const testContactName = 'testContact';

test('should calculate debt balance correctly', async t => {
    await debtManager.addDebt(senderPsid, testContactName, 4);
    await debtManager.addDebt(senderPsid, testContactName, 6);
    await debtManager.addDebt(senderPsid, 'asd', 6);
    await debtManager.addDebt(testContactName, senderPsid, 7);
    await debtManager.addDebt('gfdgvd', senderPsid, 5);

	t.true(debtManager.getBalance(senderPsid, testContactName) === 3);
});