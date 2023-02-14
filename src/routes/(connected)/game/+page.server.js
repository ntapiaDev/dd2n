import { redirect } from "@sveltejs/kit";
import { update_cells } from "$lib/server/cells";
import { add_one_day } from "$lib/server/games";
import { add_logs } from "$lib/server/logs";
import { getDefenseAll } from "$lib/player";
import { get_encampment, update_encampment } from "$lib/server/encampments";
import { get_slots_by_game, update_users } from "$lib/server/users";
import { get_worksites } from "$lib/server/worksites";

export async function load() {
    throw redirect(303, '/');
}

const nextDay = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const slots = await get_slots_by_game(locals.user.game_id, locals.rethinkdb);
    const ws = await get_worksites(locals.rethinkdb);
    const reload = ws.filter(w => w.reload);
    const temporary = ws.filter(w => w.temporary);
    const worksites = encampment.worksites;

    const broken = [];
    const toReload = [];
    let lostDef = 0;
    let defense = getDefenseAll(slots, encampment.players);

    for (let completed of worksites.completed) {
        const ap = worksites.reload.find(w => w.id === completed)?.ap;
        defense += ws.find(w => w.id === completed).defense * (ap ?? 1);
        let rech = reload.find(w => w.id === completed);
        if (rech && ap > 0) {
            worksites.reload.find(w => w.id === completed).ap = 0;
            toReload.push({
                name: rech.name,
                defense: rech.defense * ap
            })
            lostDef += rech.defense * ap;
        } else {
            let temp = temporary.find(w => w.id === completed);
            if (temp) {
                worksites.completed = worksites.completed.filter(w => w !== temp.id);
                worksites.unlocked.push({
                    ap: temp.ap,
                    id: temp.id
                })
                broken.push({
                    name: temp.name,
                    defense: temp.defense
                })
                lostDef += temp.defense;
            }
        }
    }
    const next = Math.round(encampment.attack * (1.5 + (Math.random() * 5) / 10));
    await update_encampment(locals.user.game_id, next, worksites, locals.rethinkdb);
    await add_one_day(locals.user.game_id, locals.rethinkdb);
    const { logs, zombies } = await update_cells(locals.user.game_id, locals.rethinkdb);
    const events = await update_users(locals.user.game_id, locals.rethinkdb);
    const log = [{ coordinate: 'Encampment', action: 'nextday', log: {
        attack: encampment.attack,
        broken,
        dead: events.filter(e => e.action === 'dead' || e.action === 'wound' && e.log.wound === 4),
        defense,
        lostDef,
        next,
        regenerated: logs.length,
        survived: defense >= encampment.attack,
        toReload,
        zombies
    }}]
    await add_logs(locals.user.game_id, [...logs, ...events, ...log], locals.rethinkdb);
}

export const actions = { nextDay };
