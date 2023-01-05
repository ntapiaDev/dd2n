import r from 'rethinkdb';
import layout from './layout';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max
const encampment = 'H8';
const size = 15;

export const generateMap = async (user_id, rethinkdb) => {
    // Suppression de l'ancienne carte
    await r.table('maps').filter(r.row("user_id").eq(user_id)).delete().run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    // Génération de la nouvelle carte
    let map = { user_id, encampment, 'uniques': [] }
    let rows = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 1; j < size + 1; j++) {
            const distance = Math.abs(i - letters.indexOf(encampment[0])) + Math.abs(encampment.substring(1) - j);
            const zombies = Math.floor(Math.random() * (distance - 2)); // Définit la difficulté : proximité des zombies par rapport au campement
            const visible = letters[i] + j === encampment;
            const visited = letters[i] + j === encampment;
            row.push({ 'coordinate': letters[i] + j, 'layout': layout[letters[i] + j], 'players': [], 'zombies': zombies > 0 ? zombies : 0, 'estimated': 0, 'items': [], 'searchedBy': [], visible, visited });
        }
        rows.push(row);
    }
    map.rows = rows;

    let map_id;
    await r.table('maps').insert(map).run(rethinkdb, function (err, result) {
        map_id = result.generated_keys[0];
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': 1, 'ap': 100, 'location': encampment, 'inventory': [] }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    return map_id;
}

export const getMap = async (user_id, rethinkdb) => {
    // let map;
    // await r.table('maps').filter(r.row("user_id").eq(user_id)).run(rethinkdb, function (err, cursor) {
    //     if (err) throw err;
    //     cursor.toArray(function (err, result) {
    //         if (err) throw err;
    //         map = result[0];
    //     });
    // });
    // return map;
    return r.table('maps').filter({ user_id }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0].r[0];
        });
}

export const getNextDay = async (days, power, user_id, rethinkdb) => {
    // Transformer en une seule requête update...
    let map = await getMap(user_id, rethinkdb);
    for (let row of map.rows) {
        for (let cell of row) {
            if (cell.coordinate !== encampment) {
                cell.zombies = Math.round(cell.zombies * power + 1);
                cell.searchedBy = [];
                cell.visited = false;
            }
        }
    }

    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': days + 1, 'ap': 100 }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getSearch = async (user_id, map, ap, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1) }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getTravel = async (user_id, target, ap, map, rethinkdb) => {
    await r.table('users').filter({ "id": user_id }).update({ 'location': target, 'ap': (ap - 1) }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
