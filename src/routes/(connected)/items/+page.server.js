import { fail, redirect } from "@sveltejs/kit";
import { getEquip } from "../../../utils/items";

export async function load() {
    throw redirect(303, '/');
}

const equip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    // Vérification que l'objet existe (prévoir un cas d'erreur? message flash??)
    if (inventory.find(i => i.uuid === uuid)) {
        // Factoriser --> tools, utilisé dans map et items
        const getItem = () => {
            for (let item of inventory) {
                if (item.uuid === uuid) {
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
    } else return fail(400, { item: true });
}

const unequip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.uuid === uuid))?.find(i => i.uuid === uuid);
    // Vérification que l'objet existe (prévoir un cas d'erreur? message flash??)
    if (item) {
        // On vérifie qu'il reste de la place dans l'inventaire
        const inventory = locals.user.inventory;
        if (inventory.length < 10) {
            inventory.push(item);
            slots[item.slot] = '';
            await getEquip(locals.user.id, inventory, slots, locals.rethinkdb);
        } else return fail(400, { full: true });
    } else return fail(400, { item: true });
}

export const actions = { equip, unequip };
