const _ = require('lodash')
const messengerSignedRequestParser = require('../utils/messenger-signed-request-parser')

class UsersManager {
    constructor(userGraphApi, usersRepository, threadRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
        this.threadsRepository = threadRepository;
    }

    signIn(signedRequest) {
        const saveThread = (userId, threadId, threadType) => {
            return this.threadsRepository.addUserThread({
                userId,
                threadId,
                isGroup: threadType === 'GROUP'
            })
        }

        const context = messengerSignedRequestParser.parseSignedRequest(signedRequest)
        const threadId = context.tid
        const psid = context.psid
        const threadType = context.thread_type

        return this.usersRepository.getByPsid(psid)
            .then(user => {
                if (user) {
                    return this.threadsRepository.getByUserAndThreadId(user.id, threadId)
                        .then(thread => {
                            if (thread) {
                                return { user, threadId };
                            }
                            return saveThread(user.id, threadId, threadType)
                                .then(_ => { user, threadId });
                        })
                }
        
                return this.userGraphApi.fetchUserData(psid)
                    .then(userData => {
                        userData.psid = psid
                        userData.fbId = userData.id
                        return this.usersRepository.add(userData)
                            .then(id => saveThread(id, threadId, threadType))
                            .then(_ => { user: userData, threadId })
                    });
            })
    }

    signInAssistantMode(psid) {
        return this.usersRepository.getByPsid(psid)
            .then(user => {
                if (user) {
                    return user
                }
                return this.userGraphApi.fetchUserData(psid)
                    .then(userData => {
                        userData.psid = psid
                        userData.fbId = userData.id
                        return this.usersRepository.add(userData)
                            .then(_ => userData)
                    });
            })
    }

    getUser(psid) {
        return this.usersRepository.getByPsid(psid)
    }

    getUserById(id) {
        return this.usersRepository.getById(id)
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