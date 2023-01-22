import r from 'rethinkdb';

export const _building = async (game_id, user_id, coordinate, items, uniques, building, ap, hunger, thirst, stats, rethinkdb) => {
    await r.table('cells').filter({ game_id, coordinate }).update({ items, building }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').get(user_id).update({ ap, hunger, thirst, stats }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    if (uniques.length) await r.table('games').get(game_id).update({ uniques: r.row('uniques').union(uniques) }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const _travel = async (game_id, user_id, username, location, target, estimated, ap, hunger, thirst, rethinkdb) => {
    await r.table('cells').filter({ game_id, coordinate: location }).update({ players: r.row('players').difference([username]), estimated }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('cells').filter({ game_id, coordinate: target }).update({ players: r.row('players').append(username), visible: true, visited: true }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').get(user_id).update({ location: target, ap, hunger, thirst, force: false }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

