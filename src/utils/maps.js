import r from 'rethinkdb';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max

export const generateMap = async (user_id, rethinkdb) => {
    const size = 15;
    const encampment = 'H8';

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
            row.push({ 'coordinate': letters[i] + j, 'players': [], 'zombies': zombies > 0 ? zombies : 0, 'items': [] });
        }
        rows.push(row);
    }
    map.rows = rows;

    let map_id;
    await r.table('maps').insert(map).run(rethinkdb, function (err, result) {
        map_id = result.generated_keys[0];
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': 1 }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    return map_id;
}

export const getMap = async (user_id, rethinkdb) => {
    let map;
    await r.table('maps').filter(r.row("user_id").eq(user_id)).run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            map = result[0];
        });
    });
    return map;
}

export const getNextDay = async (days, power, user_id, rethinkdb) => {
    let map = await getMap(user_id, rethinkdb);
    for (let row of map.rows) {
        for (let cell of row) {
            if (map.encampment !== cell.coordinate) cell.zombies = Math.round(cell.zombies * power + 1);
        }
    }

    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': days + 1 }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
