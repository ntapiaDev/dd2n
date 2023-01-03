<script>
    import { fly } from 'svelte/transition';
    import { user } from '../../stores/user';
	import Inventory from './Inventory.svelte';

    let player;
    user.subscribe(value => {
		player = value;
	});
</script>

<div in:fly={{ y: -30, duration: 500}}>
    {player.username} - Jour {player.days} - {player.location} - {player.ap} PA - Vie : {player.life} PV - Faim {player.hunger} - Soif : {player.thirst} - Maladie : {player.disease} - <Inventory items={player.inventory} />
</div>

<style>
    div {
        display: flex;
        align-items: center;
        margin: 0 auto;
        padding: 0.5em 2em;
        background-color: #EEE;
        border: 1px solid black;
        border-top: none;
        border-radius: 0 0 1em 1em;
    }
</style>
