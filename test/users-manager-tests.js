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
        return Promise.resolve(user.id)
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
}

class ThreadsRepositoryMock {
    constructor() {
        this.userThreads = []
    }
    addUserThread(userThread) {
        if (this.userThreads.find(ut => ut.userId === userThread.userId && ut.threadId === userThread.threadId)) {
            return Promise.reject('Duplicate user threads')
        }
        this.userThreads.push(userThread)
        return Promise.resolve()
    }
    getUserThreadsByThreadId(id) {
        return Promise.resolve(this.userThreads.filter(ut => ut.threadId === id))
    }
    getByUserAndThreadId(userId, threadId) {
        return Promise.resolve(this.userThreads.find(ut => ut.threadId === threadId && ut.userId === userId))
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
    let usersManager = new UsersManager(new GraphUsersApiMock(), usersRepositoryMock, new ThreadsRepositoryMock())

    await usersManager.signIn('1', '2')
    t.deepEqual(usersRepositoryMock.users[0], {
        fbId: '4',
        fullName: 'test user name',
        gender: 'male',
        id: 0,
        name: 'test user',
        psid: '1'
    })
});

test('should not fetch same user two times', async t => {
    let graphUsersApiMock = new GraphUsersApiMock()
    let usersManager = new UsersManager(graphUsersApiMock, new UsersRepositoryMock(), new ThreadsRepositoryMock())

    await usersManager.signIn('1', '2')
    await usersManager.signIn('1', '2')
    t.true(graphUsersApiMock.getApiCallCount() === 1)
});

test('should add thread to repository when fetching new user data', async t => {
    let threadsRepositoryMock = new ThreadsRepositoryMock()
    let usersManager = new UsersManager(new GraphUsersApiMock(), new UsersRepositoryMock(), threadsRepositoryMock)

    await usersManager.signIn('1', '2')
    t.deepEqual(threadsRepositoryMock.userThreads[0], {
        threadId: '2',
        userId: 0,
        isGroup: false
    })
});

test('should set user names in status correctly', async t => {
    let usersRepositoryMock = new UsersRepositoryMock()
    let usersManager = new UsersManager(new GraphUsersApiMock(), usersRepositoryMock, new ThreadsRepositoryMock())

    usersRepositoryMock.users[2] = { name: 'a' }
    usersRepositoryMock.users[5] = { name: 'b' }

    const status = await usersManager.setNamesInDebtStatus([{
            name: 2,
            amount : 3
        }, {
            name: 5, 
            amount: -3
        }, {
            name: null,
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
    let usersManager = new UsersManager(new GraphUsersApiMock(), new UsersRepositoryMock(), new ThreadsRepositoryMock())

    const requester = await usersManager.signIn('1', '2')
    await usersManager.signIn('2', '2')

    const threadUser = await usersManager.getUserForThreadId(requester.id, '2')

    t.is('2', threadUser.psid)
})
