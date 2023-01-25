<script>
	import { sortItems } from '$lib/loots';
	import Item from '../game/Item.svelte';
	import PlayerName from '../game/PlayerName.svelte';

	export let log;

	const feed = [
		{
			credit: 'Freepik',
			description: 'Mort de faim',
			icon: 'hunger',
			id: '781741f2-56d8-4fba-8cb7-a79ea1ab1ca7',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Mort de soif',
			icon: 'dehydrated',
			id: '9031ee03-0eb8-4f07-9bee-7218840ae2bc',
			type: 'misc',
		}
	];
	const wounds = [
		{
			credit: 'Freepik',
			description: 'Indemne',
			icon: 'healthy',
			id: '62372da1-0ac8-4bc0-a0a6-24ebcd928930',
			type: 'misc',
		},
		{
			credit: 'surang',
			description: 'Quelques égratignures',
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Gravement blessé',
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: "À l'agonie",
			icon: 'dying',
			id: '542a9d5d-36c8-42d5-b8c3-6910d7f3db00',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Décédé',
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			type: 'misc',
		}
	];	

	const firstLetterToLowerCase = (word) => {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}

	const formatDate = (log) => {
		const date = new Date(log.date);
		const addZero = (number) => {
			return number.toString().length === 2 ? number : '0' + number;
		};
		return `Le ${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} à ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
	};
</script>

<div class="log" style={`background-color: ${log.color? log.color + '20' : ''}`}>
	<span class="date">{formatDate(log)}</span>
	{#if log.action === 'newGame'}
		<PlayerName color={log.color} username={log.player} /> a rejoint la partie.
	{:else if log.action === 'inEncampment'}
		<PlayerName color={log.color} username={log.player} /> est entré{log.gender === 'female' ? 'e' : ''} dans le campement.
	{:else if log.action === 'outEncampment'}
		<PlayerName color={log.color} username={log.player} /> est sorti{log.gender === 'female' ? 'e' : ''} du campement.
	{:else if log.action === 'heal'}
		<PlayerName color={log.color} username={log.player} /> s'est soigné{log.gender === 'female' ? 'e' : ''} avec {firstLetterToLowerCase(log.log.drug)}.
    {:else if log.action === 'wound'}
        {#if log.log.wound === 0}
            <div class="item">En se réveillant ce matin, <PlayerName color={log.color} username={log.player} /> était de nouveau <Item item={wounds[0]} /></div>
        {:else if log.log.wound === 3}
            <div class="item">En se réveillant ce matin, <PlayerName color={log.color} username={log.player} /> se sentait <Item item={wounds[3]} /></div>
        {:else if log.log.wound === 4}
			<div class="item">Gravement blessé{log.gender === 'female' ? 'e' : ''}, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
        {/if}
	{:else if log.action === 'feed'}
		<PlayerName color={log.color} username={log.player} /> a {log.log.type === 'food' ? 'mangé' : 'bu'} <span class={log.log.type}>{log.log.feed.toLowerCase()}</span> et a regagné {Math.floor(log.log.value)} PA.
	{:else if log.action === 'boost'}
		<PlayerName color={log.color} username={log.player} /> a pris <span class="boost">{log.log.boost.toLowerCase()}</span> et a regagné {log.log.value} PA.
	{:else if log.action === 'tchat'}
		<PlayerName color={log.color} username={log.player} /> : <i><PlayerName color={log.color} username={log.log.message} /></i>
	{:else if log.action === 'dead'}
		{#if log.log.cause === 'both'}
			<div class="item">N'ayant rien mangé et rien bu, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'hunger'}
			<div class="item">Affamé{log.gender === 'female' ? 'e' : ''} après tous ses efforts, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'thirst'}
			<div class="item">N'ayant pu s'hydrater suffisamment, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{/if}
	{:else if log.action === 'deposit'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a déposé <Item item={log.log.item} /> dans la banque.</div>
	{:else if log.action === 'leave'}
		<PlayerName color={log.color} username={log.player} /> a quitté la partie.
	{/if}
</div>

<style>
	.log {
		width: 100%;
		position: relative;
		padding: 0.5em 1em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.5em;
		background-color: #eee;
	}
	.log:not(:last-child) {
		margin-bottom: 1em;
	}
	.log:last-child {
		margin-bottom: 0.15em;
	}
	.date {
		padding: 0 1em;
		position: absolute;
		top: -7px;
		right: 20px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 1em;
		font-size: 0.75em;
		background-color: #ddd;
		z-index: 5;
	}
	.item {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;
	}
	.food {
		color: green;
	}
	.drink {
		color: blue;
	}
	.boost {
		color: orange;
	}
</style>
