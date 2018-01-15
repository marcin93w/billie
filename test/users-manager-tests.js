const 
    test = require('ava'),
    UsersManager = require('../src/debt-manager/users-manager');

class UsersRepositoryMock {
    constructor() {
        this.users = []
    }
    add (user) {
        user.id = this.users.length
        this.users.push(user)
        return user.id
    }
    getById (id) {
        return Promise.resolve(this.users[id])
    }
    getByPsid (psid) {
        return Promise.resolve(this.users.find(u => u.psid == psid))
    }
    getByFbId (fbid) {
        return Promise.resolve(this.users.find(u.fbid == fbid))
    }
    getAll() {
        return this.users
    }
}

var userThreads = [];
const threadsRepositoryMock = {
    addUserThread(userThread) {
        userThreads.push(userThread)
    },
    getUserThreadsByThreadId(id) {
        return userThreads.filter(ut => ut.threadId === id)
    }
}

class GraphUsersApiMock {
    constructor() {
        this.apiCallCount = 0
    }
    fetchUserData (senderPsid) {
        this.apiCallCount++;
        return Promise.resolve({
            id: '4', 
            name: 'test user',
            fullName: 'test user name',
            gender: 'male' 
        })
    }
    getApiCallCount() {
        return this.apiCallCount
    }
};

test('should add user to repository when fetching new user data', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)

    await usersManager.getRequestingUser('1', '2')
    t.deepEqual(usersRepositoryMock.getAll()[0], {
        fbId: '4',
        fullName: 'test user name',
        gender: 'male',
        id: 0,
        name: 'test user',
        psid: '1'
    })
});

test('should not fetch same user two times', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)

    await usersManager.getRequestingUser('1', '2')
    await usersManager.getRequestingUser('1', '2')
    t.true(graphUsersApiMock.getApiCallCount() === 1)
});

test('should add thread to repository when fetching new user data', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)

    await usersManager.getRequestingUser('1', '2')
    t.deepEqual(userThreads[0], {
        threadId: '2',
        userId: 0,
        isGroup: false
    })
});

test('should set user names in status correctly', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)

    usersRepositoryMock.getAll()[2] = { name: 'a' }
    usersRepositoryMock.getAll()[5] = { name: 'b' }

    const status = await usersManager.setNamesInDebtStatus([{
            name: 2,
            amount : 3
        }, {
            name: 5, 
            amount: -3
        }, {
            name: 1,
            amount: 1
        }
    ]);
    t.deepEqual(status, [{
            name: 'a',
            amount : 3
        }, {
            name: 'b', 
            amount: -3
        }, {
            name: 'unaccepted',
            amount: 1
        }])
});

test('should get existing user by thread id', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, usersRepositoryMock, threadsRepositoryMock)

    const requester = await usersManager.getRequestingUser('1', '2')
    await usersManager.getRequestingUser('2', '2')

    const threadUser = await usersManager.getUserForThreadId(requester.id, '2')

    t.is('2', threadUser.psid)
})
