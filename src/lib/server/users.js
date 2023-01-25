import bcrypt from 'bcrypt';
import r from 'rethinkdb';
import { nextday_hunger, nextday_thirst } from '$lib/config';
import { encampment } from '$lib/layout';

export const add_game_to_user = async (game_id, id, color, rethinkdb) => {
    return r.table('users').get(id).update({
        alive: true,
        ap: 100,
        color,
        force: false,
        game_id,
        hunger: 75,
        location: 'Encampment',
        inventory: [{
            code: 'b1',
            credit: 'Freepik',
            description: 'Une cuisse de poulet',
            icon: 'chicken',
            id: '41805ead-1cc7-4d58-8fc5-9dd1838ab331',
            quantity: 1,
            rarity: 'commun',
            type: 'food',
            unique: false,
            uuid: crypto.randomUUID(),
            value: 20
        }, {
            code: 'b1',
            credit: 'Tanahcon',
            description: 'Une canette de coca',
            icon: 'cola',
            id: 'f8384e81-5c25-4509-96a6-f57f40a2faef',
            quantity: 1,
            rarity: 'commun',
            type: 'drink',
            unique: false,
            uuid: crypto.randomUUID(),
            value: 20
        }],
        slots: {
            W0: {
                attack: 1,
                credit: 'Freepik',
                description: 'Se battre à mains nues',
                icon: 'attack',
                id: 'd1a3d28e-bd5f-486a-b4fb-7d36254f4344',
                slot: "W0",
                type: 'misc',
            },
            W1: '',
            W2: '',
            W3: '',
            W4: '',
            A1: '',
            A2: {
                credit: 'Freepik',
                defense: 1,
                description: 'Une chemise hawaïenne',
                icon: 'shirt',
                id: 'a032c050-a549-4e68-8eef-4a037efd6bef',
                plus: 0,
                quantity: 1,
                rarity: 'commun',
                slot: 'A2',
                type: 'misc',
                unique: false,
                uuid: crypto.randomUUID()
            },
            A3: {
                credit: 'Good Ware',
                defense: 1,
                description: 'Un short en jean',
                icon: 'short',
                id: 'cfbe3557-aa69-4bbf-bf91-befa5d814852',
                plus: 0,
                quantity: 1,
                rarity: 'commun',
                slot: 'A3',
                type: 'misc',
                unique: false,
                uuid: crypto.randomUUID()
            },
        },
        stats: {
            items: 0,
            zombies: 0
        },
        thirst: 75,
        wound: 0
    }).run(rethinkdb)
}

export const add_user = async (user, rethinkdb) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const SESSIONID = crypto.randomUUID();
    await r.table('users').insert({
        gender: user.gender,
        password: hashedPassword,
        role: 'user',
        sessionid: SESSIONID,
        username: user.username
    }).run(rethinkdb);
    return SESSIONID;
}

export const _attack = async (user_id, ap, force, hunger, slots, stats, thirst, wound, rethinkdb) => {
    return r.table('users').get(user_id).update({ ap, force, hunger, slots, stats, thirst, wound }).run(rethinkdb);
}

export const _boost = async (user_id, item, ap, rethinkdb) => {
    return r.table('users').get(user_id).update({ ap, inventory: r.row('inventory').difference([item]) }).run(rethinkdb);
}

export const enter_encampment = async (user_id, rethinkdb) => {
    return r.table('users').get(user_id).update({ location: 'Encampment' }).run(rethinkdb);
}

export const _equip = async (user_id, inventory, slots, rethinkdb) => {
    return r.table('users').get(user_id).update({ inventory, slots }).run(rethinkdb);
}

export const _feed = async (user_id, item, ap, hunger, thirst, rethinkdb) => {
    return r.table('users').get(user_id).update({ ap, inventory: r.row('inventory').difference([item]), hunger, thirst }).run(rethinkdb);
}

export const _force = async (user_id, rethinkdb) => {
    return r.table('users').get(user_id).update({ force: true, wound: 2 }).run(rethinkdb);
}

export const get_by_SESSIONID = async (SESSIONID, rethinkdb) => {
    let user = (await r.table('users').filter({ sessionid: SESSIONID }).eqJoin('game_id', r.table('games')).run(rethinkdb))._responses[0]?.r[0];
    if (!user) user = (await r.table('users').filter({ sessionid: SESSIONID }).run(rethinkdb))._responses[0]?.r[0];
    return user;
}

export const get_by_username = async (username, rethinkdb) => {
    return (await r.table('users').filter({ username: username }).run(rethinkdb))._responses[0]?.r[0]
}

export const _heal = async (user_id, item, rethinkdb) => {
    return r.table('users').get(user_id).update({ inventory: r.row('inventory').difference([item]), wound: 0 }).run(rethinkdb);
}

export const leave_encampment = async (user_id, rethinkdb) => {
    return r.table('users').get(user_id).update({ location: encampment }).run(rethinkdb);
}

export const refresh_SESSIONID = async (SESSIONID, rethinkdb) => {
    const NEW_SESSIONID = crypto.randomUUID();
    await r.table('users').filter({ sessionid: SESSIONID }).update({ sessionid: NEW_SESSIONID }).run(rethinkdb);
    return NEW_SESSIONID;
}

export const remove_game_from_user = async (username, rethinkdb) => {
    return r.table('users').filter({ username }).replace(r.row.without(
        'alive', 'ap', 'color', 'force', 'game_id', 'hunger', 'location', 'inventory', 'slots', 'stats', 'thirst', 'wound'
    )).run(rethinkdb);
}

export const remove_game_from_users = async (game_id, rethinkdb) => {
    return r.table('users').filter({ game_id }).replace(r.row.without(
        'alive', 'ap', 'color', 'force', 'game_id', 'hunger', 'location', 'inventory', 'slots', 'stats', 'thirst', 'wound'
    )).run(rethinkdb);
}

export const _search = async (user_id, ap, hunger, stats, thirst, rethinkdb) => {
    return r.table('users').get(user_id).update({ ap, hunger, stats, thirst }).run(rethinkdb);
}

export const setSession = async (cookies, SESSIONID) => {
    cookies.set('SESSIONID', SESSIONID, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24
    })
}

export const _travel = async (user_id, location, ap, hunger, thirst, rethinkdb) => {
    await r.table('users').get(user_id).update({ ap, force: false, hunger, location, thirst }).run(rethinkdb);
}

export const update_users = async (game_id, rethinkdb) => {
    const players = await r.table('users').filter({ game_id }).orderBy(r.asc('username')).run(rethinkdb);
    const events = [];
    for (let player of players) {
        player.ap = 100;
        player.force = false;
        player.hunger -= nextday_hunger;
        player.thirst -= nextday_thirst;
        if (player.location !== 'Encampment') {
            player.wound = 4;
            events.push({ coordinate: player.location, player: player.username, action: 'dead', log: { cause: 'zombies' }, gender: player.gender, color: player.color });
        } else if (player.wound === 3) {
            player.wound = 4;
            events.push({ coordinate: player.location, player: player.username, action: 'wound', log: { wound: player.wound }, gender: player.gender, color: player.color });
        } else if (player.hunger <= 0 || player.thirst <= 0) {
            player.wound = 4;
            const cause = player.hunger <= 0 && player.thirst <= 0 ? 'both' :
                player.hunger <= 0 ? 'hunger' : 'thirst';
            events.push({ coordinate: player.location, player: player.username, action: 'dead', log: { cause }, gender: player.gender, color: player.color });
        } else if (player.wound) {
            if (player.wound === 1) player.wound = 0;
            else if (player.wound === 2) player.wound = 3;
            events.push({ coordinate: player.location, player: player.username, action: 'wound', log: { wound: player.wound }, gender: player.gender, color: player.color });
        }
        if (player.wound === 4) player.alive = false;
    }
    await r.table('users').insert(players, {conflict: 'update'}).run(rethinkdb);
    return events;
}
