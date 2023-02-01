import r from 'rethinkdb';

export const add_log = (game_id, coordinate, player, action, log, gender, color, rethinkdb) => {
    return r.table('logs').insert({ game_id, coordinate, player, action, log, gender, color, 'date': Date.now() }).run(rethinkdb);
}

export const add_logs = (game_id, logs, rethinkdb) => {
    for (let log of logs) {
        log.game_id = game_id;
        log.date = log.action === 'nextday' ? Date.now() + 10 : Date.now();
    }
    return r.table('logs').insert(logs).run(rethinkdb);
}

export const delete_logs = (game_id, rethinkdb) => {
    return r.table('logs').filter({ game_id }).delete().run(rethinkdb);
}

export const get_last_date = (game_id, players, rethinkdb) => {
    return r.table("logs").filter(function(log) {
        return r.expr(players).contains(log("player")).and(log("game_id").eq(game_id))
    }).orderBy(r.desc("date")).group("player").nth(0)('date').run(rethinkdb);
}

export const get_logs_by_coordinate = (game_id, coordinate, rethinkdb) => {
    return r.table('logs').filter({ game_id, coordinate }).orderBy(r.desc('date')).run(rethinkdb);
}
