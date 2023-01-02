import r from 'rethinkdb';

export const addItem = async (item, rethinkdb) => {
    let item_id;
    await r.table('items').insert(item).run(rethinkdb, function (err, result) {
        if (err) throw err;
        item_id = result.generated_keys[0];
    });
    return item_id;
}
