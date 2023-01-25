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
	const rip = {
		credit: "Eucalyp" ,
		description: "Repose en paix" ,
		icon: "rip" ,
		id: "3912a66e-6e12-47a2-a10d-a2f350d01dad" ,
		type: "misc"
	}
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
	{#if log.action === 'in'}
		<PlayerName color={log.color} username={log.player} /> est arrivé{log.gender === 'female' ? 'e' : ''} dans la zone.
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /> et <Item item={feed[1]} /></div>
		{/if}
	{:else if log.action === 'inEncampment'}
		<PlayerName color={log.color} username={log.player} /> est sorti{log.gender === 'female' ? 'e' : ''} du campement.
	{:else if log.action === 'inTunnel'}
		<PlayerName color={log.color} username={log.player} /> est sorti{log.gender === 'female' ? 'e' : ''} du passage souterrain.
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /> et <Item item={feed[1]} /></div>
		{/if}
	{:else if log.action === 'out'}
		<PlayerName color={log.color} username={log.player} /> a quitté la zone.
	{:else if log.action === 'outEncampment'}
		<PlayerName color={log.color} username={log.player} /> est entré{log.gender === 'female' ? 'e' : ''} dans le campement.
	{:else if log.action === 'outTunnel'}
		<PlayerName color={log.color} username={log.player} /> est entré{log.gender === 'female' ? 'e' : ''} dans le passage souterrain.
	{:else if log.action === 'kill'}
		<PlayerName color={log.color} username={log.player} /> a
			{log.log.weapon === "Une grenade explosive" ? 'fait sauter' :
				log.log.weapon === "Une grenade incendiaire" ? 'brûlé vif' :
				log.log.weapon === "Une grenade fumigène" ? 'enfumé' :
				log.log.weapon === "Du C-4" ? 'exterminé' : 'tué'}
			<span class="zombies">{log.log.zombies} {log.log.plus > 0 ? `(+${log.log.plus})` : ''} zombie{log.log.zombies > 1 ? 's' : ''}</span> avec <span class="zombies">{firstLetterToLowerCase(log.log.weapon)}</span>.
			{#if log.log.critical}
				<span>Un coup bien placé a permis de toucher <span class="zombies">{log.log.critical} zombie{log.log.critical > 1 ? 's' : ''}</span> supplémentaire{log.log.critical > 1 ? 's' : ''}.</span>
			{/if}
			{#if log.log.broken}
				<div>Son arme s'est brisée sous le choc.</div>
			{:else if log.log.ammo}
				<div>{log.gender === 'female' ? 'Elle' : 'Il'} n'a plus de munitions !</div>
			{/if}
			{#if log.log.woundedW0}
				{#if log.log.woundedW0 === 1}
					<div class="item">À force de se battre à mains nues, <PlayerName color={log.color} username={log.player} /> a maintenant <Item item={wounds[1]} /></div>
				{:else if log.log.woundedW0 === 2}
					<div class="item">À force de se battre à mains nues, <PlayerName color={log.color} username={log.player} /> est maintenant <Item item={wounds[2]} /></div>
				{/if}
			{:else if log.log.woundedW1}
				{#if log.log.woundedW1 === 1}
					<div class="item">Un zombie s'est approché un peu trop près et <PlayerName color={log.color} username={log.player} /> a maintenant <Item item={wounds[1]} /></div>
				{:else if log.log.woundedW1 === 2}
					<div class="item">Après un accrochage avec un zombie, <PlayerName color={log.color} username={log.player} /> est maintenant <Item item={wounds[2]} /></div>
				{/if}
			{/if}
			{#if log.log.weapon === "Une grenade fumigène"}
				<div>Cette diversion lui permet de quitter la zone en toute sécurité.</div>
			{/if}
			{#if log.log.warning === 'hunger'}
				<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /></div>
			{:else if log.log.warning === 'thirst'}
				<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} /></div>
			{:else if log.log.warning === 'both'}
				<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /> et <Item item={feed[1]} /></div>
			{/if}
		
	{:else if ['loot', 'building'].includes(log.action)}
		<div class="item">
			<PlayerName color={log.color} username={log.player} /> a trouvé {log.action === 'building' ? 'dans le bâtiment' : ''}
			<span>
				{#each sortItems(log.log.loots) as item}
					<Item {item} />
				{/each}
			</span>
		</div>
		{#if log.log.cache}
			{#each sortItems(log.log.cache) as item}
				<div class="item"><PlayerName color={log.color} username={log.player} /> a repéré une cache avec <Item {item} /> supplémentaires !</div>
			{/each}
		{/if}
		{#if log.log.plus.one || log.log.plus.two || log.log.plus.tree || log.log.plus.four}
			<PlayerName color={log.color} username={log.player} /> découvre
			{#if log.log.plus.one}{log.log.plus.one} objet{log.log.plus.one > 1 ? 's' : ''} <span class="p1">hors du commun</span>{#if (log.log.plus.two && (log.log.plus.tree || log.log.plus.four)) || (log.log.plus.tree && log.log.plus.four)}
					{', '}
				{:else if log.log.plus.two || log.log.plus.tree || log.log.plus.four}
					{' et '}
				{/if}
			{/if}
			{#if log.log.plus.two}{log.log.plus.two} objet{log.log.plus.two > 1 ? 's' : ''} <span class="p2">remarquable{log.log.plus.two > 1 ? 's' : ''}</span>{#if log.log.plus.tree && log.log.plus.four}
					{', '}
				{:else if log.log.plus.tree || log.log.plus.four}
					{' et '}
				{/if}
			{/if}
			{#if log.log.plus.tree}{log.log.plus.tree} objet{log.log.plus.tree > 1 ? 's' : ''} <span class="p3">extraordinaire{log.log.plus.tree > 1 ? 's' : ''}</span>
				{#if log.log.plus.four}
					{' et '}
				{/if}
			{/if}
			{#if log.log.plus.four}{log.log.plus.four} objet{log.log.plus.four > 1 ? 's' : ''} <span class="p4">fantastique{log.log.plus.four > 1 ? 's' : ''}</span>
			{/if}
				{' !'}
		{/if}
		{#if log.log.empty}
			<div>La zone ne semble plus contenir grand chose d'utile.</div>
		{:else if log.log.emptyBuilding}
			<div>Le bâtiment a maintenant l'air totalement vide.</div>
		{/if}
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} /> et <Item item={feed[1]} /></div>
		{/if}
	{:else if log.action === 'new'}
		L'agitation de la nuit a permis de dévoiler de nouvelles ressources...
	{:else if log.action === 'pickup'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a ramassé <Item item={log.log.item} /></div>
	{:else if log.action === 'drop'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a déposé <Item item={log.log.item} /></div>
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
	{:else if log.action === 'force'}
		<div class="not-flex">Rassemblant son courage, <PlayerName color={log.color} username={log.player} /> est passé{log.gender === 'female' ? 'e' : ''} en force et peut quitter la zone. Après une lutte acharnée, {log.gender === 'female' ? 'elle' : 'il'} est maintenant <span><Item item={wounds[2]} /></span></div>
	{:else if log.action === 'tchat'}
		<PlayerName color={log.color} username={log.player} /> : <i><PlayerName color={log.color} username={log.log.message} /></i>
	{:else if log.action === 'dead'}
		{#if log.log.cause === 'zombies'}
			<div class="not-flex">Ayant passé la nuit dehors loin des défenses de son campement, <PlayerName color={log.color} username={log.player} /> s'est fait dévorer le cerveau par des zombies <span><Item item={rip} /></span></div>
		{:else if log.log.cause === 'both'}
			<div class="item">N'ayant rien mangé et rien bu, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'hunger'}
			<div class="item">Affamé{log.gender === 'female' ? 'e' : ''} après tous ses efforts, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'thirst'}
			<div class="item">N'ayant pu s'hydrater suffisamment, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{/if}
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
	.zombies {
		color: red;
	}
	.item {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;
	}
	.food,
	.p1 {
		color: green;
	}
	.drink,
	.p2 {
		color: blue;
	}
	.p3 {
		color: purple;
	}
	.boost,
	.p4 {
		color: orange;
	}
	.not-flex {
		margin-top: 4px;
		padding-bottom: 5px;
		line-height: 12px;
	}
	.not-flex span {
		position: relative;
		top: 4px;
	}
</style>
