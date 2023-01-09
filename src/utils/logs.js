import r from 'rethinkdb';

export const addLog = async (coordinate, player, action, log, rethinkdb) => {
    return r.table('logs').insert({ coordinate, player, action, log, 'date': Date.now() }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const deleteLogs = async (rethinkdb) => {
    return r.table('logs').delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

// export const getLogs = async (rethinkdb) => {
//     return r.table('logs').run(rethinkdb)
//         .then(function (result) {
//             return result._responses[0]?.r;
//         });
// }

export const getLogsByCoordinate = async (coordinate, rethinkdb) => {
    return r.table('logs').filter({ coordinate }).orderBy(r.desc('date')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}
