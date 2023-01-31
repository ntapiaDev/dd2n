<script>
    import { getDefense as gdp } from "$lib/player";
    import { getDefense as gdw } from "$lib/worksites";
	import Item from "../game/Item.svelte";

    export let attack;
    export let completed;
    export let players;
    export let slots;
    export let worksites;

    const item = {
        credit: 'Freepik',
        description: 'DEF des survivants',
        icon: 'shield',
        id: '672a975f-9f82-446c-bef4-bd16d90d8075',
        type: 'misc'
    }

    $: defense = gdw(completed, worksites);

    const getDefense = (slots) => {
        let defense = 0;
        for (let slot of slots) {
            if (players.includes(slot.username)) defense += gdp(slot);
        }
        return defense;
    }
    $: slots = getDefense(slots);

    $: alert = attack > defense + slots;
</script>

<aside class:alert>
    <p>Nous estimons une attaque de :</p>
    <div>{attack} zombies</div>
    <p>Votre campement possède :</p>
    <div class="item">{defense + slots} (+{slots} <Item {item} />) DEF</div>
    {#if alert}
        <p>Vous devriez renforcer vos défense !</p>
    {:else
    }   <p>Vous êtes en sécurité pour ce soir...</p>
    {/if}
</aside>

<style>
    aside {
		padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(0, 128, 0, 0.1);
        border: 3px double green;
        color: green;
	}
    aside.alert {
        background-color: rgba(255, 0, 0, 0.1);
        border-color: red;
        color: red;
    }
    div {
        font-size: 1.5em;
        font-weight: bold;
    }
    .item {
		display: flex;
		align-items: center;
		gap: 4px;
	}
</style>
