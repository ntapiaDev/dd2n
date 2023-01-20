import bcrypt from 'bcrypt';
import r from 'rethinkdb';

export const add_game_to_user = async (game_id, username, encampment, rethinkdb) => {
    return r.table('users').filter({ username }).update({ game_id, 'ap': 100, 'wound': 0, 'hunger': 75, 'thirst': 75, 'force': false, 'location': encampment, 'inventory': [{
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
}

export const add_user = async (user, rethinkdb) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const SESSIONID = crypto.randomUUID();
    await r.table('users').insert({
        username: user.username,
        password: hashedPassword,
        role: 'user',
        sessionid: SESSIONID,
        game_id: ''
    }).run(rethinkdb)
        .then(function (result) {
            return result.generated_keys[0];
        });
    return SESSIONID;
}

export const get_by_SESSIONID = async (SESSIONID, rethinkdb) => {
    const result = await r.table('users').filter({ sessionid: SESSIONID }).eqJoin("game_id", r.table("games")).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
    let user = {...result?.right, ...result?.left}
    if (!result) user = await r.table('users').filter({ sessionid: SESSIONID }).run(rethinkdb)
    .then(function (result) {
        return result._responses[0]?.r[0];
    });
    return user;
}

export const get_by_username = async (username, rethinkdb) => {
    return r.table('users').filter({ username: username }).run(rethinkdb)
        .then(function (result) {
            return result._responses[0]?.r[0];
        });
}

export const refresh_SESSIONID = async (SESSIONID, rethinkdb) => {
    const NEW_SESSIONID = crypto.randomUUID();
    const result = await r.table('users').filter({ sessionid: SESSIONID }).update({ sessionid: NEW_SESSIONID }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
    if (result.replaced) return NEW_SESSIONID;
}

export const remove_game_to_user = async (username, rethinkdb) => {
    return r.table('users').filter({ username }).update({ game_id: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}

export const remove_game_to_users = async (game_id, rethinkdb) => {
    return r.table('users').filter({ game_id }).update({ game_id: '' }).run(rethinkdb)
    .then(function (result) {
        return result;
    });
}

export const setSession = async (cookies, SESSIONID) => {
    cookies.set('SESSIONID', SESSIONID, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        // 24 heures
        maxAge: 60 * 60 * 24
    })
}
