const 
    test = require('ava'),
    DebtAssistant = require('../src/debt-assistant');

const messengerMock = { 
    lastMessage: '',
    lastReceiver: '',
    send: (receiverPsid, message) => {
        messengerMock.lastReceiver = receiverPsid;
        messengerMock.lastMessage = message;
        return Promise.resolve();
    }
};

const graphUserApiMock = { 
    nameToReturn: 'testName',
    fetchName: (senderPsid) => {
        return Promise.resolve(graphUserApiMock.nameToReturn);
    }
};

const debtManagerMock = {
    debts: [],
    addDebt: (owner, debtor, amount) => {
        debtManagerMock.debts.push({owner, debtor, amount});
    }
}

const senderPsid = 'asd'

var message;
var debtAssistant;

test.beforeEach(t => {
	message = {
        nlp: {
            entities: {
                owes: 'owes',
                contact: ['testContact'],
                amount_of_money: [45]
            }
        }, 
        text: "asd"
    }
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

test('should add new debt when asked', async t => {
    debtManagerMock.debts = [];

    await debtAssistant.handleMessage(senderPsid, message);

    let debt = debtManagerMock.debts[0];
    
    t.true(debt.owner === senderPsid);
    t.true(debt.debtor === message.nlp.entities.contact[0]);
    t.true(debt.amount === message.nlp.entities.amount_of_money[0]);
});