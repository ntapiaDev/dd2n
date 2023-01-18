import r from 'rethinkdb';

export const add_log = async (game_id, coordinate, player, action, log, rethinkdb) => {
    return r.table('logs').insert({ game_id, coordinate, player, action, log, 'date': Date.now() }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const delete_logs = async (game_id, rethinkdb) => {
    return r.table('logs').filter({ game_id }).delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const get_logs_by_coordinate = async (game_id, coordinate, rethinkdb) => {
    return r.table('logs').filter({ game_id, coordinate }).orderBy(r.desc('date')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}
