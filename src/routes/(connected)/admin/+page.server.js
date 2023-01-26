import { add_item, get_items, get_resources } from "$lib/server/items";

export async function load ({ locals }) {
    const items = await get_items(locals.rethinkdb);
    const resources = await get_resources(locals.rethinkdb);
    return { items, resources };
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
    if (data.get('value')) item.value = parseInt(data.get('value'));
    if (data.get('slot')) item.slot = data.get('slot');
    if (data.get('attack')) item.attack = parseInt(data.get('attack'));
    if (data.get('durabilityMax')) item.durabilityMax = parseInt(data.get('durabilityMax'));
    if (data.get('weapon')) item.weapon = data.get('weapon');
    if (data.get('defense')) item.defense = parseInt(data.get('defense'));
    if (data.get('wound')) item.wound = data.get('wound');
    if (data.get('ap')) item.ap = parseInt(data.get('ap'));
    if (data.get('code')) item.code = data.get('code');
    await add_item(item, locals.rethinkdb);
}

const addWorksite = async ({ locals, request }) => {
    const data = await request.formData();
    const items = await get_items(locals.rethinkdb);
    const resources = [];
    for (let item of items) {
        if (data.get(item.id)) {
            const resource = { item, quantity: data.get(item.id) };
            resources.push(resource);
        };
    };
    const worksite = {
        ap: data.get('ap'),
        defense: data.get('defense'),
        name: data.get('name'),
        rarity: data.get('rarity'),
        resources
    }
    if (data.get('parent')) worksite.parent = data.get('parent');
    // Add to table worksites
}

export const actions = { addItem, addWorksite };
