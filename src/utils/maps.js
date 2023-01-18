import r from 'rethinkdb';
import { checkHT } from './tools';

const encampment = 'H8';

export const getAttack = async (user_id, map, slots, ap, hunger, thirst, wound, force, stats, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1), hunger, thirst, slots, wound, force, stats }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getMapTunnel = async (user_id, rethinkdb) => {
    return r.table('maps').filter({ user_id })('tunnel').run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const getSearch = async (user_id, map, ap, hunger, thirst, stats, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1), hunger, thirst, stats }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getTravel = async (user_id, target, ti, tj, ap, hunger, thirst, map, rethinkdb) => {
    await r.table('users').filter({ "id": user_id }).update({ 'location': target, 'i': ti, 'j': tj, 'ap': (ap - 1), hunger, thirst, 'force': false }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const _travel = async (user, location, target, rethinkdb) => {
    const estimated = {
        empty: location.empty,
        zombies: location.zombies
    }
    const { hunger, thirst, warning } = checkHT(user.hunger, user.thirst);

    await r.table('cells').filter({ game_id: user.game_id, coordinate: location.coordinate }).update({
        estimated,
        players: r.row('players').difference([user.username])
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('cells').filter({ game_id: user.game_id, coordinate: target.coordinate }).update({
        players: r.row('players').append(user.username),
        visible: true,
        visited: true
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').get(user.id).update({
        hunger,
        location: target.coordinate,
        thirst
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    return warning;
}

export const pushThrough = async (user_id, rethinkdb) => {
    await r.table('users').filter({ "id": user_id }).update({ 'force': true, 'wound': 2 }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
