const 
    test = require('ava'),
    DebtAssistant = require('../src/debt-manager/debt-assistant');

class MessengerMock {
    sendActionButtons(receiverPsid) {
        this.lastReceiver = receiverPsid;
        this.sendActionButtonsRequested = true;
        return Promise.resolve();
    }
    sendStatusMessage(receiverPsid, balance) {

    }
};

const userManagerMock = { 
    nameToReturn: 'testName',
    signIn: (psid, threadId, threadType) => {
        return Promise.resolve({ 
            id: 1,
            name: userManagerMock.nameToReturn
        });
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
var messengerMock = new MessengerMock();

test.beforeEach(t => {
	message = {
        nlp: {
            entities: {
                contact: [{ 
                    value: testContactName 
                }],
                number: [{ 
                    value: testAmount 
                }],
                Intent: [{ 
                    value: "lent" 
                }]
            }
          }, 
        text: "asd"
    };
    debtAssistant = new DebtAssistant(messengerMock, userManagerMock, debtManagerMock);
});

test('should return fallback message when entities are null', async t => {
    message.nlp.entities = null;

    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.sendActionButtonsRequested);
});

test('should return fallback message when there is no intent', async t => {
    message.nlp.entities.Intent = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.sendActionButtonsRequested);
});

test('should return fallback message when there is no contact', async t => {
    message.nlp.entities.contact = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.sendActionButtonsRequested);
});

test('should return fallback message when there is no amount', async t => {
    message.nlp.entities.number = false;
    
    await debtAssistant.handleMessage(senderPsid, message);

    t.true(messengerMock.sendActionButtonsRequested);
});
