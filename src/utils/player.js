import r from 'rethinkdb';

export const getHeal = async (user_id, inventory, wound, rethinkdb) => {
    return r.table('users').filter({ 'id': user_id }).update({ inventory, wound }).run(rethinkdb)
        .then(function (result) {
            return result;
        });
}
