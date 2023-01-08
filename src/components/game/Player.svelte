<script>
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
	import Armour from './Armour.svelte';
	import Inventory from './Inventory.svelte';

    let player;
    page.subscribe(value => {
		player = value.data.user;
	});
</script>

<div in:fly={{ y: -30, duration: 500}}>
    <span>
        {player.username} -
        Jour {player.days} -
        {player.location} -
        Vie : {player.life} PV -
        <!-- Faim {player.hunger} -
        Soif : {player.thirst} -
        Maladie : {player.disease} - -->
        <Armour items={player.inventory} slots={player.slots} /> -
        <Inventory items={player.inventory} />
    </span>
    <span>
        {player.ap} PA
    </span>
</div>

<style>
    div {
        width: 1000px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        padding: 0.5em 2em;
        background-color: #EEE;
        border: 1px solid black;
        border-top: none;
        border-radius: 0 0 1em 1em;
    }
</style>
