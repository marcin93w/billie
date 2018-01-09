var userThreads = [];

module.exports = {
    addUserThread(userThread) {
        userThreads.push(userThread)
    },
    getUserThreadsByThreadId(id) {
        return userThreads.where(ut => ut.threadId === id)
    }
}