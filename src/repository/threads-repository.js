var userThreads = [];

module.exports = {
    addUserThread(userThread) {
        const alreadyExists = userThread.find(
            ut => ut.userId == userThread.userId && ut.threadId == userThread.threadId)
        if(!alreadyExists) {
            userThreads.push(userThread)
        }
    },
    getUserThreadsByThreadId(id) {
        return userThreads.where(ut => ut.threadId === id)
    }
}