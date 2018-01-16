var db = require('./database');

module.exports = {
    addUserThread(userThread) {
        return db.none('INSERT INTO public.user_threads( \
            thread_id, user_id, is_group) \
            VALUES (${threadId}, ${userId}, ${isGroup});', userThread)
    },
    getUserThreadsByThreadId(id) {
        return db.any('SELECT user_id, is_group FROM public.user_threads WHERE thread_id = $1', id);
    },
    getByUserAndThreadId(userId, threadId) {
        return db.oneOrNone('SELECT user_id, is_group FROM public.user_threads WHERE thread_id = $1 AND user_id = $2', [threadId, userId]);
    }
}
