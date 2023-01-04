import { redirect } from "@sveltejs/kit";
import { generateMap, getMap, getNextDay, getTravel } from "../../../utils/maps";
import { canTravel } from '../../../utils/tools';

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    map.days = locals.user.days;
    return { map };
}

const nextday = async ({ locals, request }) => {
    const data = await request.formData();
    const power = parseFloat(data.get('power'));
    await getNextDay(locals.user.days, power, locals.user.id, locals.rethinkdb);
}

const reset = async ({ locals }) => {
    await generateMap(locals.user.id, locals.rethinkdb);
}

const search = async ({ locals }) => {
    // TODO : Gestion de la rareté de la case
    // const location = locals.user.location;
    const items = locals.items.filter(i => i.type !== 'misc');
    const foundItem = items[Math.floor(Math.random() * items.length)]
    console.log(foundItem);
}

const travel = async ({ locals, request }) => {
    const location = locals.user.location;
    const data = await request.formData();
    const target = data.get('target');
    const map = await getMap(locals.user.id, locals.rethinkdb);
    // Refactoriser?? utilisé sur +page.svelte aussi
    const border = (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).layout.border;
    const ap = locals.user.ap;
    // Vérification de la possibilité de voyager (anti-triche)
    if (canTravel(location, target, border, ap)) await getTravel(locals.user.id, target, ap, locals.rethinkdb);

    throw redirect(303, '/map');
}

export const actions = { nextday, reset, search, travel };
