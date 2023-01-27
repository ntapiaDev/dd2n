import r from 'rethinkdb';

export const add_worksite = async (worksite, rethinkdb) => {
    return (await r.table('worksites').insert(worksite).run(rethinkdb)).generated_keys[0];
}

export const get_worksites = async (rethinkdb) => {
    return r.table('worksites').orderBy(r.asc('rarity'), r.asc('defense')).group("parent").run(rethinkdb);
}
