import r from 'rethinkdb';
import { getBuildings, getTunnel } from '$lib/game';
import { encampment, layout, letters, size } from '$lib/layout';

export const add_tchat = async (game_id, user_id, coordinate, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).update({ tchat: r.row('tchat').append(user_id) }).run(rethinkdb);
}

export const add_user_to_encampment = async (game_id, username, encampment, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate: encampment }).update({ 'players': r.row('players').append(username) }).run(rethinkdb);
}

export const delete_cells = async (game_id, rethinkdb) => {
    return r.table('cells').filter({ game_id }).delete().run(rethinkdb);
}

export const generate_cells = async (game_id, rethinkdb) => {
    const buildings = getBuildings();
    const tunnel = getTunnel();
    let cells = [];
    let code = 1;
    for (let i = 0; i < size; i++) {
        for (let j = 1; j < size + 1; j++) {
            const building = buildings[letters[i] + j] ?? '';
            const distance = Math.abs(i - letters.indexOf(encampment[0])) + Math.abs(encampment.substring(1) - j);
            const entrance = tunnel.includes(letters[i] + j) ? tunnel.filter(c => c !== letters[i] + j)[0] : '';
            const players = [];
            const visible = letters[i] + j === encampment;
            const visited = letters[i] + j === encampment;
            let zombies = Math.floor(Math.random() * (distance - 2));
            if (zombies < 0) zombies = 0;
            if (building) zombies += 2;
            cells.push({
                building,
                code,
                coordinate: letters[i] + j,
                empty: false,
                entrance,
                estimated: { zombies: 0, empty: false },
                game_id,
                items: [],
                layout: layout[letters[i] + j],
                players,
                searchedBy: [],
                tchat: [],
                visible,
                visited,
                zombies,
            });
            code++;
        }
    }
    return r.table('cells').insert(cells).run(rethinkdb);
}

export const get_cell = async (game_id, coordinate, rethinkdb) => {
    return (await r.table('cells').filter({ game_id, coordinate }).run(rethinkdb))._responses[0]?.r[0]
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

export const kill_zombies = async (game_id, coordinate, killed, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).update({ zombies: r.row('zombies').sub(killed) }).run(rethinkdb);
}

export const remove_user_from_location = async (game_id, username, location, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate: location }).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb);
}

export const update_building = async (game_id, user_id, coordinate, items, empty, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).update({ building: { empty, searchedBy: r.row('searchedBy').append(user_id) }, items }).run(rethinkdb);
}

export const update_cells = async (game_id, rethinkdb) => {
    const cells = (await r.table('cells').filter({ game_id }).run(rethinkdb))._responses[0]?.r;
    const logs = [];    
    for (let cell of cells) {
        if (cell.building) cell.building.searchedBy = [];        
        cell.searchedBy = [];
        cell.tchat = [];
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

export const update_items = async (game_id, coordinate, items, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).update({ items }).run(rethinkdb);
}

export const update_map = async (game_id, username, location, target, estimated, rethinkdb) => {
    await r.table('cells').filter({ game_id, coordinate: location }).update({ players: r.row('players').difference([username]), estimated }).run(rethinkdb);
    return r.table('cells').filter({ game_id, coordinate: target }).update({ players: r.row('players').append(username), visible: true, visited: true }).run(rethinkdb);
}

export const update_search = async (game_id, user_id, coordinate, items, empty, rethinkdb) => {
    return r.table('cells').filter({ game_id, coordinate }).update({ empty, items, searchedBy: r.row('searchedBy').append(user_id) }).run(rethinkdb);
}
