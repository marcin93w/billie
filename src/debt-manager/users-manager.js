const _ = require('lodash')

class UsersManager {
    constructor(userGraphApi, usersRepository, threadRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
        this.threadsRepository = threadRepository;
    }

    getRequestingUser(psid, threadId, threadType) {
        var user = this.usersRepository.getByPsid(psid);
        if (user) {
            return Promise.resolve(user);
        }

        return this.userGraphApi.fetchUserData(psid)
            .then(userData => {
                userData.psid = psid
                userData.fbId = userData.id
                const id = this.usersRepository.add(userData)
                this.threadsRepository.addUserThread({
                    userId: id,
                    threadId,
                    isGroup: threadType === 'GROUP'
                })
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