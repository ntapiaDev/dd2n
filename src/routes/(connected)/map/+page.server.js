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
    const location = locals.user.location;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    const danger = (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).layout.danger;
    // TODO : Gestion de la rareté de la case
    const getItems = (danger) => {
        if (danger === 1) {
            return locals.items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel'].includes(i.rarity));
        } else if (danger === 2) {
            return locals.items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare'].includes(i.rarity));
        } else if (danger === 3) {
            return locals.items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare', 'épique'].includes(i.rarity));
        }
    }
    const items = getItems(danger);
    // Gestion de la chance de trouver tel ou tel objet? (ex: ressource haute, plan rare... (qualité plan aussi en fonction items nécessaires?))
    const foundItem = items[Math.floor(Math.random() * items.length)];
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
