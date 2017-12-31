const 
    test = require('ava'),
    DebtAssistant = require('../src/debt-assistant');

class MessengerMock {
    send(receiverPsid, message) {
        this.lastReceiver = receiverPsid;
        this.lastMessage = message;
        return Promise.resolve();
    }
};

const graphUserApiMock = { 
    nameToReturn: 'testName',
    fetchName: (senderPsid) => {
        return Promise.resolve(graphUserApiMock.nameToReturn);
    }
};

class DebtManagerMock {
    constructor(balanceToReturn) {
        this.debts = [];
        this.balanceToReturn = balanceToReturn;
    }
    addDebt (owner, debtor, amount) {
        this.debts.push({owner, debtor, amount});
    };
    getBalance (personId, contact) {
        return this.balanceToReturn;
    }
}

const senderPsid = 'asd'
const testContactName = 'testContact';
const testAmount = 45;

var message;
var debtAssistant;
var debtManagerMock = new DebtManagerMock(5);
var messengerMock = new MessengerMock();;

test.beforeEach(t => {
	message = {
        nlp: {
            entities: {
                owes: 'owes',
                contact: [{value: testContactName}],
                amount_of_money: [{value:testAmount}]
            }
        }, 
        text: "asd"
    };
    debtAssistant = new DebtAssistant(messengerMock, graphUserApiMock, debtManagerMock);
});

test('should return message with correct name', async t => {
    await debtAssistant.handleMessage(senderPsid, message);

	t.true(messengerMock.lastMessage.text.indexOf(graphUserApiMock.nameToReturn) !== -1);
});

test('should return fallback message when entities are null', async t => {
    message.nlp.entities = null;

    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.lastMessage.text.indexOf(
        "I can't understand what you're saying, please try again.") !== -1);
});

test('should return fallback message when there is no intent', async t => {
    message.nlp.entities.owes = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.lastMessage.text.indexOf(
        "I can't understand what you're saying, please try again.") !== -1);
});

test('should return fallback message when there is no contact', async t => {
    message.nlp.entities.contact = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.lastMessage.text.indexOf(
        "I can't understand what you're saying, please try again.") !== -1);
});

test('should return fallback message when there is no amount', async t => {
    message.nlp.entities.amount_of_money = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.lastMessage.text.indexOf(
        "I can't understand what you're saying, please try again.") !== -1);
});

test('should add new "owes" debt when asked', async t => {
    await debtAssistant.handleMessage(senderPsid, message);

    let debt = debtManagerMock.debts.pop();
    
    t.true(debtManagerMock.debts.length === 1);
    t.true(debt.owner === senderPsid);
    t.true(debt.debtor === testContactName);
    t.true(debt.amount === testAmount);
});

test('should add new "i owe" debt when asked', async t => {
    message.nlp.entities.owes = false;
    message.nlp.entities.owe = 'owe';

    await debtAssistant.handleMessage(senderPsid, message);

    let debt = debtManagerMock.debts.pop();
    
    t.true(debtManagerMock.debts.length === 1);
    t.true(debt.owner === testContactName);
    t.true(debt.debtor === senderPsid);
    t.true(debt.amount === testAmount);
});

test('should return proper message when adding "owes" debt', async t => {
    await debtAssistant.handleMessage(senderPsid, message);
    
    t.true(messengerMock.lastMessage.text.indexOf(
        `I saved that ${testContactName} owes you ${testAmount} now.`) !== -1);
});

test('should return proper message when adding "I owe" debt', async t => {
    message.nlp.entities.owes = false;
    message.nlp.entities.owe = 'owe';

    await debtAssistant.handleMessage(senderPsid, message);
    
    t.true(messengerMock.lastMessage.text.indexOf(
        `I saved that you owe ${testAmount} to ${testContactName}.`) !== -1);
});

test('should show positive debt status', async t => {
    message.nlp.entities.show = 'show';
    debtAssistant = new DebtAssistant(messengerMock, graphUserApiMock, new DebtManagerMock(5));

    await debtAssistant.handleMessage(senderPsid, message);
    
    t.true(messengerMock.lastMessage.text.indexOf(
        `${testContactName} owes you 5.`) !== -1);
});

test('should show negative debt status', async t => {
    message.nlp.entities.show = 'show';
    debtAssistant = new DebtAssistant(messengerMock, graphUserApiMock, new DebtManagerMock(-3));

    await debtAssistant.handleMessage(senderPsid, message);
    
    t.true(messengerMock.lastMessage.text.indexOf(
        `You owe 3 to ${testContactName}.`) !== -1);
});

test('should show empty debt status', async t => {
    message.nlp.entities.show = 'show';
    debtManagerMock.balanceToReturn = 0;

    await debtAssistant.handleMessage(senderPsid, message);
    
    t.true(messengerMock.lastMessage.text.indexOf(
        `You don't have any debts with ${testContactName}.`) !== -1);
});
