import { addItem } from "../../../utils/items";

const item = async ({ locals, request }) => {
    const data = await request.formData();
    const item = {
        'icon': data.get('icon'),
        'description': data.get('description'),
        'type': data.get('type'),
        'credit': data.get('credit'),
        'attack': parseInt(data.get('attack')) || data.get('type') !== ("blueprint" || "misc") ? 1 : 0,
        'defense': parseInt(data.get('defense')) || 0,
        'hunger': parseInt(data.get('hunger')) || 0,
        'thirst': parseInt(data.get('thirst')) || 0,
        'disease': parseInt(data.get('disease')) || 0
    };
    await addItem(item, locals.rethinkdb);
}

export const actions = { item };
