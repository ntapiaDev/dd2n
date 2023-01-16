import r from 'rethinkdb';

export const addLog = async (user_id, coordinate, player, action, log, rethinkdb) => {
    return r.table('logs').insert({ user_id, coordinate, player, action, log, 'date': Date.now() }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const deleteLogs = async (user_id, rethinkdb) => {
    await r.table('logs').filter({ user_id }).delete().run(rethinkdb);
    // Log par défaut d'arrivée sur la case du campement
    return r.table('logs').insert({ user_id, coordinate: 'H8', player: 'Nicolas', action: 'in', log: { warning: false }, 'date': Date.now() }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    // return r.table('logs').delete().run(rethinkdb)
    //     .then(function (result) {
    //         return result;
    //     });
}

export const getLogsByCoordinate = async (user_id, coordinate, rethinkdb) => {
    return r.table('logs').filter({ user_id, coordinate }).orderBy(r.desc('date')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}
