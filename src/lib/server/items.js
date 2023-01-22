import r from 'rethinkdb';
import { sortItems } from '$lib/loots';

export const add_item = async (item, rethinkdb) => {
    return (await r.table('items').insert(item).run(rethinkdb)).generated_keys[0];
}

export const get_items = async (rethinkdb) => {
    return sortItems((await r.table('items').run(rethinkdb))._responses[0]?.r);
}

export const get_items_by_code = async (code, rethinkdb) => {
    return sortItems((await r.table('items').filter({ code }).run(rethinkdb))._responses[0]?.r);
}
