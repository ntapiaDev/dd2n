import r from 'rethinkdb';
import layout from './layout';
import { getBuildings, getTunnel } from './tools';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max
const encampment = 'H8';
const size = 15;

export const generateMap = async (user_id, username, rethinkdb) => {
    // Suppression de l'ancienne carte
    await r.table('maps').filter(r.row("user_id").eq(user_id)).delete().run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    // Génération de la nouvelle carte
    const tunnel = getTunnel();
    let map = { user_id, encampment, tunnel, 'uniques': [] }
    let rows = [];
    const buildings = getBuildings();
    console.log(buildings);
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 1; j < size + 1; j++) {
            const distance = Math.abs(i - letters.indexOf(encampment[0])) + Math.abs(encampment.substring(1) - j);
            let zombies = Math.floor(Math.random() * (distance - 2)); // Définit la difficulté : proximité des zombies par rapport au campement
            const visible = letters[i] + j === encampment;
            const visited = letters[i] + j === encampment;
            const building = buildings[letters[i] + j] ?? '';
            const entrance = tunnel.includes(letters[i] + j);
            if (zombies < 0) zombies = 0;
            // Batiments avec +2 zombies? Ou zombies x2...?
            if (building) zombies += 2;
            const players = [];
            if (letters[i] + j === encampment) players.push(username);
            row.push({ 'coordinate': letters[i] + j, i, 'j': (j - 1), 'layout': layout[letters[i] + j], players, zombies, 'empty': false, 'estimated': { 'zombies': 0, 'empty': false }, 'items': [], 'searchedBy': [], visible, visited, building, entrance });
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
        'days': 1, 'ap': 100, 'wound': 0, 'hunger': 75, 'thirst': 75, 'force': false, 'location': encampment, 'i': 7, 'j': 7, 'inventory': [{
            "code": "b1",
            "credit": "Freepik",
            "description": "Une cuisse de poulet",
            "icon": "chicken",
            "id": "41805ead-1cc7-4d58-8fc5-9dd1838ab331",
            "quantity": 1,
            "rarity": "commun",
            "type": "food",
            "unique": false,
            "uuid": crypto.randomUUID(),
            "value": 20
        }, {
            "code": "b1",
            "credit": "Tanahcon",
            "description": "Une canette de coca",
            "icon": "cola",
            "id": "f8384e81-5c25-4509-96a6-f57f40a2faef",
            "quantity": 1,
            "rarity": "commun",
            "type": "drink",
            "unique": false,
            "uuid": crypto.randomUUID(),
            "value": 20
        }], 'slots': {
            'W0': {
                "attack": 1,
                "credit": 'Freepik',
                "description": 'Se battre à mains nues',
                "icon": 'attack',
                "id": 'd1a3d28e-bd5f-486a-b4fb-7d36254f4344',
                "slot": "W0",
                "type": 'misc',
            },
            'W1': '',
            'W2': '',
            'W3': '',
            'W4': '',
            'A1': '',
            'A2': {
                "credit": "Freepik",
                "defense": 1,
                "description": "Une chemise hawaïenne",
                "icon": "shirt",
                "id": "a032c050-a549-4e68-8eef-4a037efd6bef",
                "plus": 0,
                "quantity": 1,
                "rarity": "commun",
                "slot": "A2",
                "type": "misc",
                "unique": false,
                "uuid": crypto.randomUUID()
            },
            'A3': {
                "credit": "Good Ware",
                "defense": 1,
                "description": "Un short en jean",
                "icon": "short",
                "id": "cfbe3557-aa69-4bbf-bf91-befa5d814852",
                "plus": 0,
                "quantity": 1,
                "rarity": "commun",
                "slot": "A3",
                "type": "misc",
                "unique": false,
                "uuid": crypto.randomUUID()
            },
        }, 'stats': {
            'items': 0,
            'zombies': 0
        },
        'tchat': []
    }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    return map_id;
}

export const getAttack = async (user_id, map, slots, ap, hunger, thirst, wound, force, stats, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'ap': (ap - 1), hunger, thirst, slots, wound, force, stats }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const getMap = async (user_id, rethinkdb) => {
    return r.table('maps').filter({ user_id }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const getMapTunnel = async (user_id, rethinkdb) => {
    return r.table('maps').filter({ user_id })('tunnel').run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const getNextDay = async (user_id, days, location, hunger, thirst, wound, rethinkdb) => {
    // Transformer en une seule requête update...
    let map = await getMap(user_id, rethinkdb);
    const logs = [];
    for (let row of map.rows) {
        for (let cell of row) {
            if (cell.coordinate !== encampment) {
                // Petit coef si bâtiment sur la zone : +2 zombies au lieu de 1
                cell.zombies = Math.round(cell.zombies * (1 + (cell.layout.danger / 10)) + (cell.building ? 2 : 1));
                cell.visited = false;
            }
            if (location !== encampment && cell.coordinate === location) cell.visited = true;
            cell.searchedBy = [];
            if (cell.building) cell.building.searchedBy = [];
            if (cell.empty && Math.random() > 0.9) {
                cell.empty = false;
                logs.push({ user_id, 'coordinate': cell.coordinate, 'action': 'new', 'date': Date.now() });
            }
        }
    }

    if (location !== encampment) wound = 4;

    if (wound === 1) wound = 0;
    else if (wound === 2) wound = 3;
    else if (wound === 3) wound = 4;

    hunger -= 25;
    thirst -= 25;
    if (hunger <= 0 || thirst <= 0) wound = 4;

    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'days': days + 1, 'ap': 100, hunger, thirst, wound, 'force': false, 'tchat': [] }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    // A FACTORISER ;) Ajout d'un log si une case s'est régénérée pendant la nuit
    if (logs.length) await r.table('logs').insert(logs).run(rethinkdb, function (err, result) {
        if (err) throw err;
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

export const pushThrough = async (user_id, rethinkdb) => {
    await r.table('users').filter({ "id": user_id }).update({ 'force': true, 'wound': 2 }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
