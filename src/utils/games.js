import r from 'rethinkdb';

export const getAddGame = async (rethinkdb) => {
    return r.table('games').insert({
        "day": 1,
        "encampment": "H8",
        "players": [],
        "uniques": [],
        'date': Date.now()
    }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const getDeleteGame = async (id, rethinkdb) => {
    const deleted = await r.table('games').get(id).delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
    if (deleted) return r.table('users').filter({ game: id }).update({ game: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}

export const getGameById = async (id, rethinkdb) => {
    return r.table('games').get(id).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const getGames = async (rethinkdb) => {
    return r.table('games').orderBy(r.asc('date')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const getJoin = async (id, username, rethinkdb) => {
    const joined = await r.table('games').get(id).update({
        'players': r.row('players').append(username)
    }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    if (joined) return r.table('users').filter({ username }).update({ game: id }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}
export const getLeave = async (id, username, rethinkdb) => {
    const leaved = await r.table('games').get(id).update({
        'players': r.row('players').difference([username])
    }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    if (leaved) return r.table('users').filter({ username }).update({ game: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}
