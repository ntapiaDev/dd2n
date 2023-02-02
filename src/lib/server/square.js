import r from 'rethinkdb';

export const add_square = (game_id, color, category, message, username, rethinkdb) => {
    return r.table('square').insert({ game_id, color, category, message, username, date: Date.now() }).run(rethinkdb);
}

export const delete_square = (game_id, rethinkdb) => {
    return r.table('square').filter({ game_id }).delete().run(rethinkdb);
}

export const delete_square_by_id = (id, rethinkdb) => {
    return r.table('square').get(id).delete().run(rethinkdb);
}

export const edit_square = (id, message, rethinkdb) => {
    return r.table('square').get(id).update({ message }).run(rethinkdb);
}

export const get_square = (game_id, rethinkdb) => {
    return r.table('square').filter({ game_id }).orderBy(r.asc('date')).run(rethinkdb);
}

export const get_square_by_id = (id, rethinkdb) => {
    return r.table('square').get(id).run(rethinkdb);
}
