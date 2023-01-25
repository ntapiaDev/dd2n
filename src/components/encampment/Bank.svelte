<script>
	import { flip } from "svelte/animate";
	import { fade } from "svelte/transition";
	import InteractiveItem from "../game/InteractiveItem.svelte";

    export let items;

    const types = {
		food: 'Nourriture',
		drink: 'Boisson',
		drug: 'Médicament',
		weapon: 'Arme',
		ammunition: 'Munition',
		explosive: 'Explosif',
		armour: 'Armure',
		resource: 'Ressource',
		blueprint: 'Plan',
		misc: 'Divers'
    };
    const getItems = (items) => {
        let bank = {}
		let type = items[0]?.type;
        let row = [];
        for (let item of items) {
            if (item.type === type) row.push(item);
            else {
                bank[type] = row;
                type = item.type;
                row = [];
                row.push(item);
            }
        }
        if (type) bank[type] = row;
        return bank;
    };
    $: bank = getItems(items);
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Banque commune :</h3>
    {#if !items.length}
        <span>Les coffres du campement sont vides.</span>
    {:else}
        {#each Object.keys(types) as type}
            {#if bank[type]}
                <h3 class="type">{types[type]} :</h3>
                {#each bank[type] as item (item.uuid)}
                    <span animate:flip>
                        <InteractiveItem {item} action={'/encampment?/withdraw'} />
                    </span>
                {/each}
            {/if}
        {/each}
    {/if}
</div>

<style>
    div {
		padding: 0.5em;
        border: 1px solid #aaa;
		overflow-y: auto;
    }
    h3 {
        margin-bottom: 0.5em;
    }
    h3.type {
        margin-top: 0.5em;
        margin-bottom: 0;
    }
    span {
		display: inline-block;
	}
</style>
