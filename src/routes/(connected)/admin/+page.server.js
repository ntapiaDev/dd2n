import { add_item, get_items } from "$lib/server/items";

export async function load ({ locals }) {
    const items = await get_items(locals.rethinkdb);
    return { items };
}

const addItem = async ({ locals, request }) => {
    const data = await request.formData();
    const item = {
        'icon': data.get('icon'),
        'description': data.get('description'),
        'type': data.get('type'),
        'credit': data.get('credit')
    };
    if (data.get('rarity')) item.rarity = data.get('rarity');
    if (data.get('unique')) item.unique = data.get('unique') === "unique";
    if (data.get('slot')) item.slot = data.get('slot');
    if (data.get('attack')) item.attack = parseInt(data.get('attack'));
    if (data.get('durabilityMax')) item.durabilityMax = parseInt(data.get('durabilityMax'));
    if (data.get('weapon')) item.weapon = data.get('weapon');
    if (data.get('defense')) item.defense = parseInt(data.get('defense'));
    if (data.get('wound')) item.wound = data.get('wound');
    if (data.get('code')) item.code = data.get('code');
    await add_item(item, locals.rethinkdb);
}

export const actions = { addItem };
