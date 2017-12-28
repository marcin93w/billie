const 
    test = require('ava'),
    DebtAssistant = require('../src/debt-assistant');

test('sampleTest', async t => {
    let messengerCalled = false,
        userApiCalled = false;
    const messengerMock = { 
        send: (senderPsid, message) => {
            messengerCalled = true;
            return Promise.resolve();
        }
    };
    const graphUserMock = { 
        fetchName: (senderPsid) => {
            userApiCalled = true;
            return Promise.resolve('test');
        }
    };
    const debtAssistant = new DebtAssistant(messengerMock, graphUserMock);

    await debtAssistant.handleMessage('asd', {"nlp": {"entities":null}, "text": "asd"});

	t.true(messengerCalled);
	t.true(userApiCalled);
});
