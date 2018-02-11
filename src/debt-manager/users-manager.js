class UsersManager {
    constructor(userGraphApi, usersRepository) {
        this.userGraphApi = userGraphApi;
        this.usersRepository = usersRepository;
    }

    signIn(psid) {
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
                            .then(() => userData)
                    });
            })
    }
};

module.exports = UsersManager