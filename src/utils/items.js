import r from 'rethinkdb';
import { sortItems } from './tools';

export const getAddItem = async (item, rethinkdb) => {
    let item_id;
    await r.table('items').insert(item).run(rethinkdb, function (err, result) {
        if (err) throw err;
        item_id = result.generated_keys[0];
    });
    return item_id;
}

export const getItems = async (rethinkdb) => {
    let items;
    await r.table('items').orderBy('id').run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            items = result;
        });
    });
    return sortItems(items);
}

// Importance de l'ordre? Enlever l'item avant de le déplacer pour éviter les duplicas?
export const moveItem = async (user_id, map, inventory, rethinkdb) => {
    await r.table('maps').filter(r.row("user_id").eq(user_id)).update(map).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter(r.row("id").eq(user_id)).update({ 'inventory': inventory }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
