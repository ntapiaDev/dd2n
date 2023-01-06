import { getAddItem, getItems } from "../../../utils/items";

export async function load ({ locals }) {
    const items = await getItems(locals.rethinkdb);
    return { items };
}

const addItem = async ({ locals, request }) => {
    const data = await request.formData();
    const item = {
        'icon': data.get('icon'),
        'description': data.get('description'),
        'type': data.get('type'),
        'rarity': data.get('rarity'),
        'unique': data.get('unique') === "unique",
        'hunger': parseInt(data.get('hunger')) || 0,
        'thirst': parseInt(data.get('thirst')) || 0,
        'disease': parseInt(data.get('disease')) || 0,
        'attack': parseInt(data.get('attack')) || (data.get('type') !== ("drug" && "ammunition" && "blueprint" && "misc") ? 1 : 0),
        'defense': parseInt(data.get('defense')) || 0,
        'credit': data.get('credit')
    };
    await getAddItem(item, locals.rethinkdb);
}

export const actions = { addItem };
