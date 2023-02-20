<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { sortItems } from "$lib/loots";
	import Item from '../game/Item.svelte';

    const upgrade = {
        credit: 'Freepik',
        description: 'Améliorer',
        icon: 'upgrade',
        id: '775f97d1-31ff-4f01-9684-1f3332e47bca',
        type: 'misc'
    }

    const getItems = (pool) => {
        const items = [];
        for (let item of pool) 
            if (!items.some(i => i.id === item.id && i.plus === item.plus)) items.push(item);
        return items;
    }

    $: bank = sortItems($page.data.encampment.items.filter(i => ['bag', 'weapon', 'armour'].includes(i.type)));
    $: upgradable = bank.filter(item => bank.filter(material => material.id === item.id && material.plus === item.plus).length >= 2 || item.quantity >= 2);
    $: items = getItems(upgradable);
</script>

<div class="upgrade">
    <h3>Amélioration d'objets :</h3>
    <p>Vous pouvez améliorer un objet <b>(+1)</b> en combinant deux objets identiques pour <b>1 PA</b>.</p>
    <div class="grid">
        {#each items as item}
            <div class={'item ' + (item.plus === 0 ? 'one' : item.plus === 1 ? 'two' : item.plus === 2 ? 'three' : 'four')}>
                <Item item={{ ...item,
                    durability: 0,
                    quantity: item.slot === 'W1' ? upgradable.filter(i => i.id === item.id && i.plus === item.plus).length : item.quantity }} />
                <form method="POST" action="/encampment?/upgrade" use:enhance>
                    <input type="text" name="uuid" value={item.uuid} hidden>
                    <button>
                        <Item item={upgrade} border={1 > $page.data.user.ap ? 'red' : ''} />
                    </button>
                </form>
                <Item item={{ ...item,
                    attack: item.type === 'weapon' ? item.attack + 1 : item.attack,
                    capacity: item.type === 'bag' ? item.capacity + 1 : item.capacity,
                    defense: item.type === 'armour' ? item.defense + 1 : item.defense,
                    durability: 0,
                    plus: item.plus + 1,
                    quantity: item.slot === 'W1' ? bank.filter(i => i.id === item.id && i.plus === item.plus + 1).length : bank.find(i => i.id === item.id && i.plus === item.plus + 1)?.quantity }} />
            </div>
        {/each}
    </div>
</div>

<style>
    .upgrade {
        margin-top: 1em;
    }
    p {
        margin: 0.5em 0;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1FR);
        gap: 2px;
    }
    .item {
        padding: 0.5em;
        display: flex;
        justify-content: center;
        background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
    }
    form {
		width: 25px;
		height: 25px;
        margin: 0 0.25em;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
    .one {
		box-shadow: 0 0 3px rgba(0, 128, 0, 0.66), 0 2px 4px rgba(0, 128, 0, 0.66);
	}
	.two {
		box-shadow: 0 0 3px rgba(0, 0, 255, 0.66), 0 2px 4px rgba(0, 0, 255, 0.66);
	}
	.three {
		box-shadow: 0 0 3px rgba(128, 0, 128, 0.66), 0 2px 4px rgba(128, 0, 128, 0.66);
	}
	.four {
		box-shadow: 0 0 3px rgba(255, 165, 0, 0.66), 0 2px 4px rgba(255, 165, 0, 0.66);
	}
</style>