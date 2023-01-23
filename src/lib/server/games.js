import r from 'rethinkdb';
import { getRandomName } from '$lib/game';
import { encampment } from '$lib/layout';

export const add_game = async (rethinkdb) => {
    return (await r.table('games').insert({
        colors: [
            { name: 'Violet', code: "#9400D3", taken: false },
            { name: 'Indigo', code: "#4B0082", taken: false },
            { name: 'Bleu', code: "#0000FF", taken: false },
            { name: 'Vert', code: "#008000", taken: false },
            { name: 'Orange', code: "#FF7F00", taken: false },
            { name: 'Rouge', code: "#FF0000", taken: false },
            { name: 'Marron', code: "#800000", taken: false }
        ],
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

export const add_unique = async (game_id, uniques, rethinkdb) => {
    return r.table('games').get(game_id).update({ uniques: r.row('uniques').union(uniques) }).run(rethinkdb);
}

export const add_user_to_game = async (game_id, username, color, rethinkdb) => {
    await r.table('games').get(game_id).update(array => {
        return {
            colors: array('colors').map(c => {
                return c('code').eq(color).branch(
                    c.merge({taken: true}),
                    c
                )
            })
        }
    }).run(rethinkdb);
    await r.table('games').get(game_id).update({ players: r.row('players').append({ color, username }) }).run(rethinkdb);
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

export const remove_user_from_game = async (game_id, username, color, rethinkdb) => {
    await r.table('games').get(game_id).update(array => {
        return {
            colors: array('colors').map(c => {
                return c('code').eq(color).branch(
                    c.merge({taken: false}),
                    c
                )
            })
        }
    }).run(rethinkdb);
    return r.table('games').get(game_id).update({ players: r.row('players').difference([{ color, username }]) }).run(rethinkdb);
}
