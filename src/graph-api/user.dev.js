module.exports = {
    fetchUserData: (senderPsid) => {
        return Promise.resolve({
            id: senderPsid, 
            name: 'test user',
            fullName: 'test user name',
            gender: 'male',
            profilePic: 'https://www.w3schools.com/howto/img_avatar.png' 
        })
    }
};