<script>
    import { fly } from 'svelte/transition';
	import Item from './Item.svelte';
    import { player } from '../../stores/player';

    let user;
    player.subscribe(value => {
		user = value;
	});
</script>

<div in:fly={{ y: -30, duration: 500}}>
    {user.username} - Jour actuel : {user.days} - Case actuelle : {user.location} - {user.ap} PA - Vie : {user.life} PV - Faim {user.hunger} - Soif : {user.thirst} - Maladie : {user.disease} - Inventaire :
    <Item id="14faa653-5798-4b1a-86be-a08cd396acde" /><Item id="4a8c8331-5c9c-4034-b4ff-69f8c0b43922" /><Item id="617094a7-ea8b-446a-8e00-76664e1413b8" /><Item id="95e76f54-8ca9-4528-bcc0-3c159dde7c8b" /><Item id="c278c863-00df-4e52-b283-d6affb244cda" />
    (5/10)
</div>

<style>
    div {
        margin: 0 auto;
        padding: 0.2em 2em 0.5em 2em;
        background-color: #EEE;
        border: 1px solid black;
        border-top: none;
        border-radius: 0 0 1em 1em;
    }
</style>
