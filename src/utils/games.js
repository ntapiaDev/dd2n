import r from 'rethinkdb';
import layout from './layout';
import { getBuildings, getRandomName, getTunnel } from './tools';

const encampment = 'H8';
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']; //15 * 15 = 225 cases
const size = 15;

export const add_game = async (rethinkdb) => {
    const game_id = await r.table('games').insert({
        date: Date.now(),
        day: 1,
        encampment,
        name: getRandomName(),
        players: [],
        uniques: [],
    }).run(rethinkdb)
        .then(function (result) {
            return result.generated_keys[0];
        });

    const buildings = getBuildings();
    const tunnel = getTunnel();

    let cells = [];
    let code = 1;
    for (let i = 0; i < size; i++) {
        for (let j = 1; j < size + 1; j++) {
            const distance = Math.abs(i - letters.indexOf(encampment[0])) + Math.abs(encampment.substring(1) - j);
            let zombies = Math.floor(Math.random() * (distance - 2)); // Définit la difficulté : proximité des zombies par rapport au campement
            const visible = letters[i] + j === encampment;
            const visited = letters[i] + j === encampment;
            const building = buildings[letters[i] + j] ?? '';
            const entrance = tunnel.includes(letters[i] + j) ? tunnel.filter(c => c !== letters[i] + j)[0] : '';
            if (zombies < 0) zombies = 0;
            // Batiments avec +2 zombies? Ou zombies x2...?
            if (building) zombies += 2;
            const players = [];
            cells.push({ game_id, code, 'coordinate': letters[i] + j, 'layout': layout[letters[i] + j], players, zombies, 'empty': false, 'estimated': { 'zombies': 0, 'empty': false }, 'items': [], 'searchedBy': [], visible, visited, building, entrance });
            code++;
        }
    }
    await r.table('cells').insert(cells).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const delete_game = async (game_id, rethinkdb) => {
    await r.table('games').get(game_id).delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
    await r.table('cells').filter({ game_id }).delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
    return r.table('users').filter({ game_id }).update({ game_id: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}

export const get_game_by_id = async (game_id, rethinkdb) => {
    return r.table('games').get(game_id).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const get_games = async (rethinkdb) => {
    return r.table('games').orderBy(r.asc('date')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const join_game = async (game_id, username, rethinkdb) => {
    await r.table('games').get(game_id).update({ 'players': r.row('players').append(username) }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    await r.table('cells').filter({ game_id, coordinate: encampment }).update({ 'players': r.row('players').append(username) }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    await r.table('users').filter({ username }).update({ game_id, 'ap': 100, 'wound': 0, 'hunger': 75, 'thirst': 75, 'force': false, 'location': encampment, 'inventory': [{
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
    }).run(rethinkdb)
        .then(function (result) {
            return result;
    });
    return encampment;
}

export const leave_game = async (game_id, username, location, rethinkdb) => {
    await r.table('games').get(game_id).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    await r.table('cells').filter({ game_id, coordinate: location }).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    return r.table('users').filter({ username }).update({ game_id: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}
