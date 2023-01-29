import r from 'rethinkdb';

export const add_worksite = async (worksite, rethinkdb) => {
    return (await r.table('worksites').insert(worksite).run(rethinkdb)).generated_keys[0];
}

export const get_worksite = async (id, rethinkdb) => {
    return r.table('worksites').get(id).run(rethinkdb);
}

export const get_worksites = async (rethinkdb) => {
    return r.table('worksites').orderBy(r.asc('rarity'), r.asc('defense'), r.asc('name')).run(rethinkdb);
}

export const get_worksites_by_group = async (rethinkdb) => {
    return r.table('worksites').group("parent").orderBy(r.asc('rarity'), r.asc('defense'), r.asc('name')).run(rethinkdb);
}
