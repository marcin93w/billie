module.exports = {
    fetchUserData: (senderPsid) => {
        return Promise.resolve({
            id: senderPsid, 
            name: 'Grzegorz',
            fullName: 'Grzegorz Brzęczyszczykiewicz',
            gender: 'male',
            profilePic: 'https://www.w3schools.com/howto/img_avatar.png' 
        })
    }
};