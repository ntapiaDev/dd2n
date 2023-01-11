import bcrypt from 'bcrypt';
import r from 'rethinkdb';

export const addUser = async (user, rethinkdb) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const SESSIONID = crypto.randomUUID();
    let user_id;
    await r.table('users').insert({
        'username': user.username,
        'password': hashedPassword,
        'role': 'user',
        'sessionid': SESSIONID,
        'days': 1,
        'location': 'H8',
        'ap': 100,
        'wound': 0,
        'hunger': 100,
        'thirst': 100,
        'inventory': [],
        'slots': {
            'W1': {},
            'W2': {},
            'W3': {},
            'W4': {},
            'A1': {},
            'A2': {},
            'A3': {},
        }
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
        user_id = result.generated_keys[0];
    });
    return { user_id, SESSIONID };
}

export const getBySESSIONID = async (SESSIONID, rethinkdb) => {
    return r.table('users').filter({ sessionid: SESSIONID }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const getByUsername = async (username, rethinkdb) => {
    let user;
    await r.table('users').filter(r.row("username").eq(username)).run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            user = result[0];
        });
    });
    return user;
}

export const refreshSESSIONID = async (SESSIONID, rethinkdb) => {
    const NEW_SESSIONID = crypto.randomUUID();
    await r.table('users').filter(r.row("sessionid").eq(SESSIONID)).update({ "sessionid": NEW_SESSIONID }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    return NEW_SESSIONID;
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
