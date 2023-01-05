import { fail, redirect } from "@sveltejs/kit";
import { generateMap, getMap, getNextDay, getSearch, getTravel } from "../../../utils/maps";
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
    throw redirect(303, '/map');
}

const reset = async ({ locals }) => {
    await generateMap(locals.user.id, locals.rethinkdb);
}

const search = async ({ locals }) => {
    const ap = locals.user.ap;
    const location = locals.user.location;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    if (ap > 0 && location !== map.encampment) {
        // Si la case a déjà été fouillée ce jour, on renvoie une erreur
        if ((map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).searchedBy.includes(locals.user.id)) return fail(400, { searched: true });
        const danger = (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).layout.danger;
        // Gestion de la rareté de la case
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
        let pool = [];
        for (let item of items) {
            // Probabilité en fonction du type
            const type = item.type === 'resource' ? 10 :
                ['food', 'drink', 'ammunition'].includes(item.type) ? 3 :
                ['drug', 'weapon', 'armour'].includes(item.type) ? 2 : 1;
            // Probabilité en fonction de la rareté
            const rarity = item.rarity === 'commun' ? 5 :
                item.rarity === 'inhabituel' ? 3 :
                item.rarity === 'rare' ? 2 : 1;
            for (let i = 0; i < (type * rarity); i++) {
                pool.push(item);
            }
        }
        const foundItem = pool[Math.floor(Math.random() * pool.length)];
        // On met l'item entier dans la case de la map
        // Faire en une seule fois??
        (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).items.push(foundItem);
        (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).searchedBy.push(locals.user.id);
        await getSearch(locals.user.id, map, ap, locals.rethinkdb)
    }
}

const travel = async ({ locals, request }) => {
    const ap = locals.user.ap;
    if (ap > 0) {
        const location = locals.user.location;
        const data = await request.formData();
        const target = data.get('target');
        const map = await getMap(locals.user.id, locals.rethinkdb);
        // Refactoriser?? utilisé sur +page.svelte aussi
        const border = (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).layout.border;
        // Vérification de la possibilité de voyager (anti-triche)
        if (canTravel(location, target, border)) {
            // Faire en une seule fois?? (check si déjà visible et visité ou non??)
            (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).visible = true;
            (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).visited = true;
            await getTravel(locals.user.id, target, ap, map, locals.rethinkdb);
        }
    }
    throw redirect(303, '/map');
}

export const actions = { nextday, reset, search, travel };
