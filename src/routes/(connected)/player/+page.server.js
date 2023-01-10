import { fail, redirect } from "@sveltejs/kit";
import { addLog } from "../../../utils/logs";
import { getHeal } from "../../../utils/player";

export async function load() {
    throw redirect(303, '/');
}

const heal = async ({ locals, request }) => {
    // On vérifie que le joueur est blessé
    let wound = locals.user.wound;
    if (!wound) return fail(400, { healthy: true });
    const data = await request.formData();
    const id = data.get('id');
    const inventory = locals.user.inventory;
    // On vérifie que l'item est bien présent dans l'inventaire
    if (!inventory.some(i => i.id === id)) return fail(400, { origin: true });
    // On récupère l'item
    const getItem = () => {
        for (let item of inventory) {
            if (item.id === id) {
                inventory.splice(inventory.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem();
    // On vérifie que l'item est bien un médicament
    if (item.type !== 'drug') return fail(400, { drug: true });    
    if (wound === 1 || wound === 2 && item.rarity ==='rare' || item.rarity === 'épique') wound = 0;
    else return fail(400, { weak: true });
    await getHeal(locals.user.id, inventory, wound, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'heal', { 'drug': item.description }, locals.rethinkdb);
}

export const actions = { heal };
