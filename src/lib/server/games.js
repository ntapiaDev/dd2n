import r from 'rethinkdb';
import { encampment } from '$lib/layout';
import { getRandomName } from '../../utils/tools';

export const add_game = async (rethinkdb) => {
    return (await r.table('games').insert({
        date: Date.now(),
        day: 1,
        encampment,
        name: getRandomName(),
        players: [],
        uniques: [],
    }).run(rethinkdb)).generated_keys[0]
}

export const add_one_day = async (game_id, rethinkdb) => {
    return r.table('games').get( game_id ).update({ day: r.row('day').add(1) }).run(rethinkdb);
}

export const add_user_to_game = async (game_id, username, rethinkdb) => {
    await r.table('games').get(game_id).update({ 'players': r.row('players').append(username) }).run(rethinkdb);
    return encampment;
}

export const delete_game = async (game_id, rethinkdb) => {
    return r.table('games').get(game_id).delete().run(rethinkdb);
}

export const get_game_by_id = async (game_id, rethinkdb) => {
    return r.table('games').get(game_id).run(rethinkdb);
}

export const get_games = async (rethinkdb) => {
    return r.table('games').orderBy(r.asc('date')).run(rethinkdb);
}

export const remove_user_from_game = async (game_id, username, rethinkdb) => {
    return r.table('games').get(game_id).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb);
}
