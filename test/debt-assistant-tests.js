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
        debts.push({owner, debtor, amount});
    }
}

const senderPsid = 'asd'

let message = {
    'nlp': {
        'entities':null
    }, 
    'text': "asd"
}

test('should return message with correct name', async t => {
    const debtAssistant = new DebtAssistant(messengerMock, graphUserApiMock, debtManagerMock);

    await debtAssistant.handleMessage(senderPsid, message);

	t.true(messengerMock.lastMessage.text.indexOf(graphUserApiMock.nameToReturn) !== -1);
});
