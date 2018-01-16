const _ = require('lodash')

class UsersManager {
    constructor(userGraphApi, usersRepository, threadRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
        this.threadsRepository = threadRepository;
    }

    signIn(psid, threadId, threadType) {
        const saveThread = (userId, threadId, threadType) => {
            if(threadId) {
                return this.threadsRepository.addUserThread({
                    userId,
                    threadId,
                    isGroup: threadType === 'GROUP'
                })
            }
            return Promise.resolve()
        }

        return this.usersRepository.getByPsid(psid)
            .then(user => {
                if (user) {
                    if (!threadId) {
                        return user;
                    }
                    return this.threadsRepository.getByUserAndThreadId(user.id, threadId)
                        .then(thread => {
                            if (thread) {
                                return user;
                            }
                            return saveThread(user.id, threadId, threadType)
                                .then(_ => user);
                        })
                }
        
                return this.userGraphApi.fetchUserData(psid)
                    .then(userData => {
                        userData.psid = psid
                        userData.fbId = userData.id
                        return this.usersRepository.add(userData)
                            .then(id => saveThread(id, threadId, threadType))
                            .then(_ => userData)
                    });
            })
    }

    getUser(psid) {
        return this.usersRepository.getByPsid(psid)
    }

    setNamesInDebtStatus(status) {
        return Promise.all(status.map(entry => 
            this.usersRepository.getById(entry.name).then(user => {
                entry.name = user ? user.name : 'unaccepted';
                return entry;
            })
        ))
    }

    getUserForThreadId(requesterId, threadId) {
        return this.threadsRepository.getUserThreadsByThreadId(threadId)
            .then(threadUsers => threadUsers.find(t => t.userId !== requesterId && t.isGroup === false))
            .then(threadUser => {
                if(!threadUser) {
                    return Promise.resolve(null)
                }
                return this.usersRepository.getById(threadUser.userId)
            })
    }
};

module.exports = UsersManager