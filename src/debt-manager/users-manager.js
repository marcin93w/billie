const _ = require('lodash')

class UsersManager {
    constructor(userGraphApi, usersRepository, threadRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
        this.threadsRepository = threadRepository;
    }

    getRequestingUser(psid, threadId, threadType) {
        const saveThread = (userId, threadId, threadType) => {
            if (threadId) {
                this.threadsRepository.addUserThread({
                    userId,
                    threadId,
                    isGroup: threadType === 'GROUP'
                })
            }
        }

        return this.usersRepository.getByPsid(psid)
            .then(user => {
                if (user) {
                    saveThread(user.id, threadId, threadType)
                    return Promise.resolve(user);
                }
        
                return this.userGraphApi.fetchUserData(psid)
                    .then(userData => {
                        userData.psid = psid
                        userData.fbId = userData.id
                        const id = this.usersRepository.add(userData)
                        saveThread(id, threadId, threadType)
                        return userData
                    });

            })
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
        const threadUser = this.threadsRepository.getUserThreadsByThreadId(threadId)
            .find(t => t.userId !== requesterId && t.isGroup === false)

        if(!threadUser) {
            return Promise.resolve(null)
        }

        return this.usersRepository.getById(threadUser.userId)
    }
};

module.exports = UsersManager