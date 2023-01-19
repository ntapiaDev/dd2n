import r from 'rethinkdb';
import { sortItems } from './tools';

export const getAddItem = async (item, rethinkdb) => {
    return r.table('items').insert(item).run(rethinkdb)
        .then(function (result) {
            return result.generated_keys[0];
        });
}

export const getEquip = async (user_id, inventory, slots, rethinkdb) => {
    await r.table('users').filter({ id: user_id }).update({ inventory, slots }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}

export const get_items = async (rethinkdb) => {
    return r.table('items').run(rethinkdb)
        .then(function (result) {
            return sortItems(result._responses[0]?.r);
        });
}

export const getItemsByCode = async (code, rethinkdb) => {
    return r.table('items').filter({ code }).run(rethinkdb)
        .then(function (result) {
            return sortItems(result._responses[0]?.r ?? []);
        });
}

// Importance de l'ordre? Enlever l'item avant de le déplacer pour éviter les duplicas?
export const moveItem = async (user_id, map, inventory, slots, rethinkdb) => {
    await r.table('maps').filter({ user_id }).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter({ id: user_id }).update({ inventory, slots }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
