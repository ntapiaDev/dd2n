<script>
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
	import Armour from './Armour.svelte';
	import Inventory from './Inventory.svelte';
	import Weapon from './Weapon.svelte';

    let player;
    page.subscribe(value => {
		player = value.data.user;
	});
</script>

<div in:fly={{ y: -30, duration: 500}}>
    <span>
        <!-- {player.username} -
        Jour {player.days} -
        {player.location} - -->
        <!-- Vie : {player.life} PV - -->
        <!-- Faim {player.hunger} -
        Soif : {player.thirst} -
        Maladie : {player.disease} - -->
        <Weapon items={player.inventory} W1={player.slots.W1} W2={player.slots.W2} W3={player.slots.W3} /> -
        <Armour items={player.inventory} A1={player.slots.A1} A2={player.slots.A2} A3={player.slots.A3} /> -
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
