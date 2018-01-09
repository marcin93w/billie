module.exports = {
    fetchUserData: (senderPsid) => {
        return Promise.resolve({
            id: senderPsid, 
            name: 'test user',
            fullName: 'test user name',
            gender: 'male' 
        })
    }
};