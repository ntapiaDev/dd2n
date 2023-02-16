<script>
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
	import Armour from './Armour.svelte';
	import Bag from './Bag.svelte';
	import Inventory from './Inventory.svelte';
	import Status from './Status.svelte';
	import Weapon from './Weapon.svelte';

    let player;
    page.subscribe(value => {
		player = value.data.user;
	});
</script>

<div in:fly={{ y: -30, duration: 500 }}>
    <span class="container">
        <Status />
        <Weapon items={player.inventory} W1={player.slots.W1} W2={player.slots.W2} W3={player.slots.W3} W4={player.slots.W4} />
        <Armour items={player.inventory} A1={player.slots.A1} A2={player.slots.A2} A3={player.slots.A3} />
        <Bag items={player.inventory} B1={player.slots.B1} B2={player.slots.B2} />
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
        padding: 0.5em 1.5em;
        background-color: #EEE;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-top: none;
        border-radius: 0 0 1em 1em;
    }
    .container {
        display: flex;
    }
</style>
