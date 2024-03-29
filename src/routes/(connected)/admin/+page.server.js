import { add_item, get_items, get_resources } from "$lib/server/items";
import { add_recipe, get_recipes, get_workshop } from "$lib/server/workshop";
import { add_worksite, get_worksites, get_worksites_by_group } from "$lib/server/worksites";

export async function load ({ locals }) {
    const groups = await get_worksites_by_group(locals.rethinkdb);
    const items = await get_items(locals.rethinkdb);
    const recipes = await get_recipes(locals.rethinkdb);
    const resources = await get_resources(locals.rethinkdb);
    const workshop = await get_workshop(locals.rethinkdb);
    const worksites = await get_worksites(locals.rethinkdb);
    return { groups, items, recipes, resources, workshop, worksites };
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
    if (data.get('unique')) item.unique = data.get('unique') === 'unique';
    if (data.get('value')) item.value = parseInt(data.get('value'));
    if (data.get('slot')) item.slot = data.get('slot');
    if (data.get('attack')) item.attack = parseInt(data.get('attack'));
    if (data.get('durabilityMax')) item.durabilityMax = parseInt(data.get('durabilityMax'));
    if (data.get('weapon')) item.weapon = data.get('weapon');
    if (data.get('defense')) item.defense = parseInt(data.get('defense'));
    if (data.get('wound')) item.wound = data.get('wound');
    if (data.get('capacity')) item.capacity = parseInt(data.get('capacity'));
    if (data.get('ap')) item.ap = parseInt(data.get('ap'));
    if (data.get('code')) item.code = data.get('code');
    if (data.get('origin')) item.origin = data.get('origin');
    await add_item(item, locals.rethinkdb);
}

const addRecipe = async ({ locals, request }) => {
    const data = await request.formData();
    const items = await get_items(locals.rethinkdb);
    const resources = [];
    for (let item of items) {
        if (data.get(item.id)) {
            const resource = { item, quantity: parseInt(data.get(item.id)) };
            resources.push(resource);
        };
    };
    const result = items.find(i => i.id === data.get('result'));
    const recipe = {
        ap: result.rarity === 'inhabituel' ? 1 : result.rarity === 'rare' ? 2 : 3,
        item: data.get('result'),
        name: result.description,
        quantity: parseInt(data.get('quantity')),
        rarity: result.rarity,
        resources,
        type: result.type,
        unlocked: data.get('unlocked') === 'unlocked'
    }
    await add_recipe(recipe, locals.rethinkdb);
}

const addWorksite = async ({ locals, request }) => {
    const data = await request.formData();
    const items = await get_items(locals.rethinkdb);
    const resources = [];
    for (let item of items) {
        if (data.get(item.id)) {
            const resource = { item, quantity: parseInt(data.get(item.id)) };
            resources.push(resource);
        };
    };
    const worksite = {
        advance: data.get('advance') === 'advance',
        completed: data.get('completed') === 'completed',
        defense: parseInt(data.get('defense')),
        name: data.get('name'),
        rarity: data.get('rarity'),
        resources,
        type: 'defense',
        unlocked: data.get('unlocked') === 'unlocked'
    }
    if (data.get('ap')) worksite.ap = parseInt(data.get('ap'));
    if (data.get('description')) worksite.description = data.get('description');
    if (data.get('parent')) worksite.parent = data.get('parent');
    if (data.get('temporary') === "temporary") worksite.temporary = true;
    await add_worksite(worksite, locals.rethinkdb);
}

export const actions = { addItem, addRecipe, addWorksite };
