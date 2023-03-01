import r from 'rethinkdb';

export const add_meal = (game_id, username, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            tavern: {
                players: doc("tavern")("players").append(username)
            }
        }
    }).run(rethinkdb);
}

export const add_user_to_encampment = (game_id, username, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ 'players': r.row('players').append(username) }).run(rethinkdb);
}

export const add_recipe = (game_id, id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            workshop: {
                recipes: doc("workshop")("recipes").append(id)
            }
        }
    }).run(rethinkdb);
}

export const add_reload = (game_id, id, ap, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            worksites: {
                reload: doc("worksites")("reload").append({ id, ap })
            }
        }
    }).run(rethinkdb);
}

export const add_worksite = (game_id, ap, id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            worksites: {
                unlocked: doc("worksites")("unlocked").append({ ap, id })
            }
        }
    }).run(rethinkdb);
}

export const build = (game_id, ap, id, type, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            [type]: {
                unlocked: doc(type)("unlocked").map(function(worksite) {
                    return r.branch(
                        worksite("id").eq(id),
                        worksite.merge({"ap": worksite('ap').sub(ap)}),
                        worksite
                    );
                })
            }
        };
    }).run(rethinkdb);
}

export const built = (game_id, items, id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            items,
            worksites: {
                completed: doc("worksites")("completed").append(id),
                unlocked: doc("worksites")("unlocked").filter(function(worksite) {
                    return worksite("id").ne(id)
                })
            }
        }
    }).run(rethinkdb);
}

export const delete_encampment = (game_id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).delete().run(rethinkdb);
}

export const do_reload = (game_id, id, ap, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            worksites: {
                reload: doc("worksites")("reload").map(function(worksite) {
                    return r.branch(
                        worksite("id").eq(id),
                        worksite.merge({"ap": worksite('ap').add(ap)}),
                        worksite
                    );
                })
            }
        };
    }).run(rethinkdb);
}

export const do_tavern = (game_id, items, id, level, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            items,
            tavern: {
                completed: doc("tavern")("completed").append(id),
                level,
                unlocked: doc("tavern")("unlocked").filter(function(worksite) {
                    return worksite("id").ne(id)
                })
            }
        }
    }).run(rethinkdb);
}

export const generate_encampment = (game_id, attack, completed, tavern, unlocked, recipes, rethinkdb) => {
    return r.table('encampments').insert({
        attack,
        game_id,
        items: [],
        players: [],
        tavern: {
            completed: [],
            level: -1,
            players: [],
            unlocked: tavern
        },
        workshop: {
            recipes,
            unlocked: false
        },
        worksites: {
            completed,
            reload: [],
            unlocked
        }
    }).run(rethinkdb);
}

export const get_bank = async (game_id, rethinkdb) => {
    return (await r.table('encampments').filter({ game_id })('items').run(rethinkdb))._responses[0]?.r[0];
}

export const get_encampment = async (game_id, rethinkdb) => {
    return (await r.table('encampments').filter({ game_id }).run(rethinkdb))._responses[0]?.r[0];
}

export const remove_user_from_encampment = (game_id, username, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ 'players': r.row('players').difference([username]) }).run(rethinkdb);
}

export const unlock_tavern = (game_id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(() => {
        return {
            tavern: {
                level: 0
            }
        }
    }).run(rethinkdb);
}

export const unlock_workshop = (game_id, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(() => {
        return {
            workshop: {
                unlocked: true
            }
        }
    }).run(rethinkdb);
}

export const update_attack = (game_id, attack, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ attack }).run(rethinkdb);
}

export const update_bank = (game_id, items, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update({ items }).run(rethinkdb);
}

export const update_encampment = (game_id, attack, worksites, rethinkdb) => {
    return r.table('encampments').filter({ game_id }).update(function(doc) {
        return {
            attack,
            tavern: {
                players: []
            },
            worksites
        }
    }).run(rethinkdb);
}
