import r from 'rethinkdb';
import { sortItems } from '$lib/loots';

export const add_item = async (item, rethinkdb) => {
    return (await r.table('items').insert(item).run(rethinkdb)).generated_keys[0];
}

export const get_from = async (origin, rethinkdb) => {
    const item = (await r.table('items').filter({ origin }).run(rethinkdb))._responses[0]?.r[0];
    item.quantity = 1;
    item.uuid = crypto.randomUUID();
    return item;
}

export const get_items = async (rethinkdb) => {
    return sortItems((await r.table('items').run(rethinkdb))._responses[0]?.r);
}

export const get_items_by_code = async (code, rethinkdb) => {
    return sortItems((await r.table('items').filter({ code }).run(rethinkdb))._responses[0]?.r);
}

export const get_loots = async (rethinkdb) => {
    return sortItems((await r.table('items').filter(function (doc) {
        return r.not(doc.hasFields("origin"))
            .and(doc('type').ne('misc'))
        }).run(rethinkdb))._responses[0]?.r);
}

export const get_resources = async (rethinkdb) => {
    return sortItems((await r.table('items').filter({ type: 'resource' }).run(rethinkdb))._responses[0]?.r);
}
