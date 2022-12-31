import r from 'rethinkdb';

export const getByUsername = async (username, rethinkdb) => {
    let user;
    await r.table('users').filter(r.row("username").eq(username)).run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            user = result[0];
        });
    });
    return user
}

export const getBySESSIONID = async (SESSIONID, rethinkdb) => {
    let user;
    await r.table('users').filter(r.row("sessionid").eq(SESSIONID)).run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            user = result[0];
        });
    });
    return user
}

export const refreshSESSIONID = async (SESSIONID, rethinkdb) => {
    const NEW_SESSIONID = crypto.randomUUID();
    await r.table('users').filter(r.row("sessionid").eq(SESSIONID)).update({"sessionid": NEW_SESSIONID}).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    return NEW_SESSIONID
}
