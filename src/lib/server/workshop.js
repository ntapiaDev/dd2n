import r from 'rethinkdb';

export const add_recipe = async (recipe, rethinkdb) => {
    return (await r.table('workshop').insert(recipe).run(rethinkdb)).generated_keys[0];
}

export const get_recipe = async (id, rethinkdb) => {
    return (await r.table('workshop').filter({ id }).eqJoin(r.row('item'), r.table("items")).run(rethinkdb))._responses[0]?.r[0];
}

export const get_recipes = async (rethinkdb) => {
    return r.table('workshop').eqJoin(r.row('item'), r.table("items")).orderBy(
        r.asc(r.row('left')('rarity')),
        r.asc(r.row('left')('type')),
        r.asc(r.row('left')('name'))
    ).run(rethinkdb);
}

export const get_workshop = async (rethinkdb) => {
    return r.table('workshop').orderBy(r.asc('rarity'), r.asc('type'), r.asc('name')).run(rethinkdb);
}
