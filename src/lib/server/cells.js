import r from 'rethinkdb';
import layout from '$lib/layout';
import { getBuildings, getTunnel } from '../../utils/tools';

const encampment = 'H8';
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']; //15 * 15 = 225 cases
const size = 15;

export const add_user_to_encampment = async (game_id, username, encampment, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate: encampment }).update({ 'players': r.row('players').append(username) }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}

export const delete_cells = async (game_id, rethinkdb) => {
    return r.table('cells').filter({ game_id }).delete().run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const generate_cells = async (game_id, rethinkdb) => {
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
    return r.table('cells').insert(cells).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const get_cell = async (game_id, coordinate, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).run(rethinkdb)
    .then(function (result) {
        return result._responses[0]?.r[0];
    });
}

export const get_map = async (game_id, rethinkdb) => {
    const cells = await r.table('cells').filter({ game_id }).orderBy(r.asc('code')).run(rethinkdb);        
    const rows = [];
    let code = 0;
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(cells[code]);
            code++;
        }
        rows.push(row);
    }
    return rows;
}

export const remove_user_from_location = async (game_id, username, location, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate: location }).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const update_cells = async (game_id, rethinkdb) => {
    const cells = (await r.table('cells').filter({ game_id }).run(rethinkdb))._responses[0]?.r;
    const logs = [];    
    for (let cell of cells) {
        if (cell.building) cell.building.searchedBy = [];        
        cell.searchedBy = [];
        if (cell.coordinate !== encampment) {
            if (!cell.players.length) cell.visited = false;
            cell.zombies = Math.round(cell.zombies * (1 + (cell.layout.danger / 10)) + (cell.building ? 2 : 1));
        }
        if (cell.empty && Math.random() > 0.9) {
            cell.empty = false;
            logs.push({ coordinate: cell.coordinate, action: 'new', log: '' });
        }
    }
    await r.table('cells').insert(cells, {conflict: 'update'}).run(rethinkdb);
    return logs;
}
