import r from 'rethinkdb';

export const add_user_to_encampment = (game_id, username, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ 'players': r.row('players').append(username) }).run(rethinkdb);
}

export const delete_encampment = (game_id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).delete().run(rethinkdb);
}

export const generate_encampment = (game_id, rethinkdb) => {
    return r.table('encampments').insert({
        attack: 0,
        blueprints: [],
        game_id,
        items: [],
        logs: [],
        players: []
    }).run(rethinkdb);
}

export const get_encampment = async (game_id, rethinkdb) => {
    return (await r.table('encampments').filter({ game_id }).run(rethinkdb))._responses[0]?.r[0];
}

export const remove_user_from_encampment = (game_id, username, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb);
}
