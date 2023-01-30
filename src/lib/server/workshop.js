import r from 'rethinkdb';

export const add_recipe = async (recipe, rethinkdb) => {
    return (await r.table('workshop').insert(recipe).run(rethinkdb)).generated_keys[0];
}

export const get_recipe = async (id, rethinkdb) => {
    return r.table('workshop').get(id).run(rethinkdb);
}

export const get_recipes = async (rethinkdb) => {
    return r.table('workshop').orderBy(r.asc('rarity'), r.asc('name')).run(rethinkdb);
}
