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
            row.push({ 'coordinate': letters[i] + j, i, 'j': (j - 1), 'layout': layout[letters[i] + j], 'players': [], 'zombies': zombies > 0 ? zombies : 0, 'estimated': 0, 'items': [], 'searchedBy': [], visible, visited });
        }
        rows.push(row);
    }
    map.rows = rows;

    let map_id;
    await r.table('maps').insert(map).run(rethinkdb, function (err, result) {
        map_id = result.generated_keys[0];
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({
        'days': 1, 'ap': 100, 'wound': 0, 'hunger': 75, 'thirst': 75, 'location': encampment, 'i': 7, 'j': 7, 'inventory': [{
            "attack": 0,
            "credit": "Freepik",
            "defense": 0,
            "description": "Une cuisse de poulet",
            "disease": 0,
            "hunger": 1,
            "icon": "poulet",
            "id": "41805ead-1cc7-4d58-8fc5-9dd1838ab331",
            "quality": 100,
            "rarity": "commun",
            "thirst": 0,
            "type": "food",
            "unique": false,
            "uuid": crypto.randomUUID(),
            "value": 20
        }, {
            "attack": 0,
            "credit": "Tanahcon",
            "defense": 0,
            "description": "Une canette de coca",
            "disease": 0,
            "hunger": 0,
            "icon": "cola",
            "id": "f8384e81-5c25-4509-96a6-f57f40a2faef",
            "quality": 100,
            "rarity": "commun",
            "thirst": 1,
            "type": "drink",
            "unique": false,
            "uuid": crypto.randomUUID(),
            "value": 20
        }], 'slots': {
            'W0': {
                "attack": 1,
                "credit": 'Freepik',
                "defense": 0,
                "description": 'Se battre à mains nues',
                "disease": 0,
                "hunger": 0,
                "icon": 'attack',
                "id": 'd1a3d28e-bd5f-486a-b4fb-7d36254f4344',
                "rarity": 'commun',
                "slot": "W0",
                "thirst": 0,
                "type": 'misc',
                "unique": false
            },
            'W1': '',
            'W2': '',
            'W3': '',
            'A1': '',
            'A2': {
                "attack": 0,
                "credit": "Freepik",
                "defense": 1,
                "description": "Une chemise hawaïenne",
                "disease": 0,
                "hunger": 0,
                "icon": "shirt",
                "id": "a032c050-a549-4e68-8eef-4a037efd6bef",
                "quality": 100,
                "rarity": "commun",
                "slot": "A2",
                "thirst": 0,
                "type": "misc",
                "unique": false,
                "uuid": crypto.randomUUID()
            },
            'A3': {
                "attack": 0,
                "credit": "Good Ware",
                "defense": 1,
                "description": "Un short en jean",
                "disease": 0,
                "hunger": 0,
                "icon": "short",
                "id": "cfbe3557-aa69-4bbf-bf91-befa5d814852",
                "quality": 100,
                "rarity": "commun",
                "slot": "A3",
                "thirst": 0,
                "type": "misc",
                "unique": false,
                "uuid": crypto.randomUUID()
            },
        }
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    return map_id;
}

export const getAttack = async (user_id, map, slots, ap, hunger, thirst, wound, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1), 'hunger': (hunger - 1), 'thirst': (thirst - 1), slots, wound }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
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
            return result._responses[0]?.r[0];
        });
}

export const getNextDay = async (user_id, days, location, hunger, thirst, wound, rethinkdb) => {
    // Transformer en une seule requête update...
    let map = await getMap(user_id, rethinkdb);
    for (let row of map.rows) {
        for (let cell of row) {
            if (cell.coordinate !== encampment) {
                cell.zombies = Math.round(cell.zombies * (1 + (cell.layout.danger / 10)) + 1);
                cell.visited = false;
            }
            if (location !== encampment && cell.coordinate === location) cell.visited = true;
            cell.searchedBy = [];
        }
    }
    if (wound === 1) wound = 0;
    else if (wound === 2) wound = 3;
    else if (wound === 3) wound = 4;

    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': days + 1, 'ap': 100, 'hunger': (hunger - 25), 'thirst': (thirst - 25), wound }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getSearch = async (user_id, map, ap, hunger, thirst, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1), 'hunger': (hunger - 1), 'thirst': (thirst - 1) }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getTravel = async (user_id, target, ti, tj, ap, hunger, thirst, map, rethinkdb) => {
    await r.table('users').filter({ "id": user_id }).update({ 'location': target, 'i': ti, 'j': tj, 'ap': (ap - 1), 'hunger': (hunger - 1), 'thirst': (thirst - 1) }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
