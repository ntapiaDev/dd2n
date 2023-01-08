import { redirect } from "@sveltejs/kit";
import { getEquip } from "../../../utils/items";

export async function load() {
    throw redirect(303, '/');
}

const equip = async ({ locals, request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const inventory = locals.user.inventory;
    // Vérification que l'objet existe (prévoir un cas d'erreur? message flash??)
    if (inventory.find(i => i.id === id)) {
        // Factoriser --> tools, utilisé dans map et items
        const getItem = () => {
            for (let item of inventory) {
                if (item.id === id) {
                    inventory.splice(inventory.indexOf(item), 1);
                    return item;
                }
            }
        }
        const item = getItem();
        const slots = locals.user.slots;
        // On remet l'item équipé dans l'inventaire
        if (slots[item.slot]) inventory.push(slots[item.slot]);
        slots[item.slot] = item;
        await getEquip(locals.user.id, inventory, slots, locals.rethinkdb);
    }
}

export const actions = { equip };
