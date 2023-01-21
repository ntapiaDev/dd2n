import r from 'rethinkdb';

// Importance de l'ordre? Enlever l'item avant de le déplacer pour éviter les duplicas?
export const move_item = async (game_id, user_id, coordinate, items, inventory, slots, rethinkdb) => {
    await r.table('cells').filter({ game_id, coordinate }).update({ items }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
    await r.table('users').filter({ id: user_id }).update({ inventory, slots }).run(rethinkdb, function (err, result) {
        if (err) throw err;
    });
}
