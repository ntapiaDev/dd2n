<script>
    import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
    import { player } from '../../stores/player';

    let user;
    player.subscribe(value => {
		user = value;
	});
</script>

<div in:fly={{ y: -30, duration: 500}}>
    {user.username} - Jour actuel : {user.days} - Case actuelle : {user.location} - {user.ap} PA - Vie : {user.life} PV - Faim {user.hunger} - Soif : {user.thirst} - Maladie : {user.disease} - Inventaire :
    <Icon icon="water" title="Une bouteille d'eau minérale"/>
    <Icon icon="sandwich" title="Un sandwich végétarien" />
    <Icon icon="gun" title="Un pistolet de policier" />
    <Icon icon="rifle" title="Un fusil militaire" />
    <Icon icon="pill" title="Du paracétamol" />
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
