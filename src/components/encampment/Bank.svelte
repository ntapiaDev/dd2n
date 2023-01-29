<script>
	import { flip } from "svelte/animate";
	import { fade } from "svelte/transition";
	import InteractiveItem from "../game/InteractiveItem.svelte";

    export let items;

    let total = 0;
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
        let quantity = 0;
        total = 0;
		let type = items[0]?.type;
        let row = [];
        for (let item of items) {
            if (item.type === type) {
                quantity += item.quantity;
                row.push(item);
                total += item.quantity;
            }
            else {
                bank[type] = { quantity, row };
                quantity = item.quantity;
                type = item.type;
                row = [];
                row.push(item);
                total += item.quantity;
            }
        }
        if (type) {
            bank[type] = { quantity, row };
        }
        return bank;
    };
    $: bank = getItems(items);
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Banque commune ({ total }) :</h3>
    <p>Vous pouvez entreposer ici tous les objets de votre campement.<br>
    Les ressources de la banque commune sont automatiquement utilisées lors de la construction d'un chantier de défense ou pour les transformations dans l'atelier de recyclage.</p>
    {#if !items.length}
        <span class="empty">Les coffres du campement sont vides.</span>
    {:else}
        {#each Object.keys(types) as type}
            {#if bank[type]}
                <h3 class="type">{types[type]} ({ bank[type].quantity }) :</h3>
                {#each bank[type].row as item (item.uuid)}
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
    p {
        color: rgb(100, 100, 100);
        margin-bottom: 0.5em;
    }
    span {
		display: inline-block;
	}
    .empty {
        font-weight: bold;
    }
</style>
