import { addItem } from "../../../utils/items";

const item = async ({ locals, request }) => {
    const data = await request.formData();
    const item = {
        'icon': data.get('icon'),
        'description': data.get('description'),
        'attack': parseInt(data.get('attack')) || 1,
        'defense': parseInt(data.get('defense')) || 0,
        'hunger': parseInt(data.get('hunger')) || 0,
        'thirst': parseInt(data.get('thirst')) || 0,
        'disease': parseInt(data.get('disease')) || 0
    };
    
    const item_id = await addItem(item, locals.rethinkdb);
    console.log(item_id);
}

export const actions = { item };
