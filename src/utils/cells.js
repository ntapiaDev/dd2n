import r from 'rethinkdb';
import { get_game_by_id } from './games';

const encampment = 'H8';
const size = 15;

export const get_cell = async (game_id, coordinate, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).run(rethinkdb)
    .then(function (result) {
        return result._responses[0]?.r[0];
    });
}

export const get_map = async (game_id, rethinkdb) => {
    const map = await r.table('cells').filter({ game_id }).orderBy(r.asc('code')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    const rows = [];
    let code = 0;
    for (let i = 0; i < size; i++) {
        let cells = [];
        for (let j = 0; j < size; j++) {
            cells.push(map[code]);
            code++;
        }
        rows.push(cells);
    }
    return rows;
}

export const next_day = async (game_id, user_id, hunger, thirst, wound, rethinkdb) => {
    const game = await get_game_by_id(game_id, rethinkdb);
    await r.table('games').get( game_id ).update({ day: game.day + 1 }).run(rethinkdb)
        .then(function (result) {
            return result;
        });

    const cells = await r.table('cells').filter({ game_id }).orderBy(r.asc('code')).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    
    const logs = [];    
    for (let cell of cells) {
        if (cell.coordinate !== encampment) {
            // Petit coef si bâtiment sur la zone : +2 zombies au lieu de 1
            cell.zombies = Math.round(cell.zombies * (1 + (cell.layout.danger / 10)) + (cell.building ? 2 : 1));
            cell.visited = false;
        }
        if (cell.players.length) cell.visited = true;
        cell.searchedBy = [];
        if (cell.building) cell.building.searchedBy = [];
        if (cell.empty && Math.random() > 0.9) {
            cell.empty = false;
            logs.push({ user_id, 'coordinate': cell.coordinate, 'action': 'new', log: '' });
        }
    }
    await r.table('cells').insert(cells, {conflict: 'update'}).run(rethinkdb)
        .then(function (result) {
            return result;
        });

    // Pour tous les joueurs
    const players = await r.table('users').filter({ game_id }).orderBy(r.asc('username')).run(rethinkdb)
        .then(function (result) {
            return result;
        });

    const events = [];
    for (let player of players) {
        player.ap = 100;
        player.day++;
        player.force = false;
        player.hunger -= 25;
        player.tchat = [];
        player.thirst -= 25;
        if (player.location !== encampment) {
            player.wound = 4;
            events.push({ location: player.location, username: player.username, action: 'dead', cause: 'zombies' });
        } else if (player.wound === 3) {
            player.wound = 4;
            events.push({ location: player.location, username: player.username, action: 'wound', wound: player.wound });
        } else if (player.hunger <= 0 || player.thirst <= 0) {
            player.wound = 4;
            const cause = player.hunger <= 0 && player.thirst <= 0 ? 'both' :
                player.hunger <= 0 ? 'hunger' : 'thirst';
            events.push({ location: player.location, username: player.username, action: 'dead', cause });
        } else if (player.wound) {
            if (player.wound === 1) player.wound = 0;
            else if (player.wound === 2) player.wound = 3;
            events.push({ location: player.location, username: player.username, action: 'wound', wound: player.wound });
        }
    }
    await r.table('users').insert(players, {conflict: 'update'}).run(rethinkdb)
        .then(function (result) {
            return result;
        });

    // Ajout d'un log si une case s'est régénérée pendant la nuit
    if (logs.length) await r.table('logs').insert(logs).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });

    return events;
}
