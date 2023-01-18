import bcrypt from 'bcrypt';
import r from 'rethinkdb';

export const addUser = async (user, rethinkdb) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const SESSIONID = crypto.randomUUID();
    await r.table('users').insert({
        username: user.username,
        password: hashedPassword,
        role: 'user',
        sessionid: SESSIONID,
        game_id: ''
    }).run(rethinkdb)
        .then(function (result) {
            return result.generated_keys[0];
        });
    return SESSIONID;
}

export const getBySESSIONID = async (SESSIONID, rethinkdb) => {
    return r.table('users').filter({ sessionid: SESSIONID }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const getByUsername = async (username, rethinkdb) => {
    return r.table('users').filter({ username: username }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const refreshSESSIONID = async (SESSIONID, rethinkdb) => {
    const NEW_SESSIONID = crypto.randomUUID();
    const result = await r.table('users').filter({ sessionid: SESSIONID }).update({ sessionid: NEW_SESSIONID }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    if (result.replaced) return NEW_SESSIONID;
}

export const setSession = async (cookies, SESSIONID) => {
    cookies.set('SESSIONID', SESSIONID, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        // 24 heures
        maxAge: 60 * 60 * 24
    })
}
