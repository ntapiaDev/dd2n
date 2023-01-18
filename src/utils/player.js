import r from 'rethinkdb';

export const add_tchat = async (user_id, location, rethinkdb) => {
    return r.table('users').filter({ id: user_id }).update({
        'tchat': r.row('tchat').append(location)
    }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const getFeed = async (user_id, inventory, hunger, thirst, ap, rethinkdb) => {
    return r.table('users').filter({ id: user_id }).update({ inventory, hunger, thirst, ap }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}

export const getHeal = async (user_id, inventory, wound, rethinkdb) => {
    return r.table('users').filter({ id: user_id }).update({ inventory, wound }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}
