const logger = require('../utils/logger');

class UsersManager {
    constructor(userGraphApi, usersRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
    }

    signIn(psid) {
        return this.usersRepository.getByPsid(psid)
            .then(user => {
                if (user) {
                    logger.trace('User found in database', user)
                    return user
                }
                return this.userGraphApi.fetchUserData(psid)
                    .then(userData => {
                        logger.trace('New user fetched from GraphAPI', userData)
                        userData.psid = psid
                        userData.fbId = userData.id
                        return this.usersRepository.add(userData)
                            .then(() => userData)
                    });
            })
    }
};

module.exports = UsersManager