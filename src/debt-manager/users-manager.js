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

        var user = this.usersRepository.getByPsid(psid);
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
    }

    setNamesInDebtStatus(status) {
        return _.mapKeys(status, (value, userId) => {
            const user = this.usersRepository.getById(userId)
            if (user) {
                return user.name
            } else {
                return 'unaccepted'
            }
        })
    }
};

module.exports = UsersManager