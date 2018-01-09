const 
    test = require('ava'),
    UsersManager = require('../src/debt-manager/users-manager');

var users = [];
const usersRepositoryMock = {
    add (user) {
        user.id = users.length
        users.push(user)
        return user.id
    },
    getById (id) {
        return users[id]
    },
    getByPsid (psid) {
        return users.find(u => u.psid == psid)
    },
    getByFbId (fbid) {
        return users.find(u.fbid == fbid)
    },
    updateByPsid (psid, props) {
        const user = this.getByPsid(psid)
        if (user) {
            Object.assign(user, props);
            return true;
        } else {
            return false;
        }
    }
}

var userThreads = [];
const threadsRepositoryMock = {
    addUserThread(userThread) {
        userThreads.push(userThread)
    },
    getUserThreadsByThreadId(id) {
        return userThreads.where(ut => ut.threadId === id)
    }
}

var apiCallCount = 0;
const graphUsersApiMock = {
    fetchUserData: (senderPsid) => {
        apiCallCount++;
        return Promise.resolve({
            id: '4', 
            name: 'test user',
            fullName: 'test user name',
            gender: 'male' 
        })
    }
};

var usersManager;

test.beforeEach(t => {
    users = [];
    userThreads = [];
    apiCallCount = 0;
    usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)
});

test('should add user to repository when fetching new user data', async t => {
    await usersManager.getRequestingUser('1', '2')
    t.deepEqual(users[0], {
        fbId: '4',
        fullName: 'test user name',
        gender: 'male',
        id: 0,
        name: 'test user',
        psid: '1'
    })
});

test('should not fetch same user two times', async t => {
    await usersManager.getRequestingUser('1', '2')
    await usersManager.getRequestingUser('1', '2')
    t.true(apiCallCount === 1)
});

test('should add thread to repository when fetching new user data', async t => {
    await usersManager.getRequestingUser('1', '2')
    t.deepEqual(userThreads[0], {
        threadId: '2',
        userId: 0,
        isGroup: false
    })
});
