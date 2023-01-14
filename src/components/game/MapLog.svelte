<script>
	// import { fade } from "svelte/transition";
	import { sortItems } from '../../utils/tools';
	import Item from './Item.svelte';

	export let log;

	const formatDate = (log) => {
		const date = new Date(log.date);
		const addZero = (number) => {
			return number.toString().length === 2 ? number : '0' + number;
		};
		return `Le ${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} à ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
	};

	const firstLetterToLowerCase = (word) => {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}

	const wounds = [
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Indemne',
			disease: 0,
			hunger: 0,
			icon: 'healthy',
			id: '62372da1-0ac8-4bc0-a0a6-24ebcd928930',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'surang',
			defense: 0,
			description: 'Quelques égratignures',
			disease: 0,
			hunger: 0,
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Gravement blessé',
			disease: 0,
			hunger: 0,
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: "À l'agonie",
			disease: 0,
			hunger: 0,
			icon: 'dying',
			id: '542a9d5d-36c8-42d5-b8c3-6910d7f3db00',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0 ,
			credit: "Smashicons" ,
			defense: 0 ,
			description: "Décédé" ,
			disease: 0 ,
			hunger: 0 ,
			icon: "dead" ,
			id: "1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8" ,
			rarity: "commun" ,
			thirst: 0 ,
			type: "misc" ,
			unique: false
		}
	];
</script>

<div class="log">
	<span class="date">{formatDate(log)}</span>
	{#if log.action === 'in'}
		<div>{log.player} est arrivé dans la zone.</div>
	{:else if log.action === 'out'}
		<div>{log.player} a quitté la zone.</div>
	{:else if log.action === 'inTunnel'}
		<div>{log.player} est sorti du passage souterrain.</div>
	{:else if log.action === 'outTunnel'}
		<div>{log.player} est entrée dans le passage souterrain.</div>
	{:else if log.action === 'kill'}
		<div>{log.player} a
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
				<div>Il n'a plus de munitions !</div>
			{/if}
			{#if log.log.woundedW0}
				{#if log.log.woundedW0 === 1}
					<div>À force de se battre à mains nues, {log.player} a maintenant <Item item={wounds[1]} /></div>
				{:else if log.log.woundedW0 === 2}
					<div>À force de se battre à mains nues, {log.player} est maintenant <Item item={wounds[2]} /></div>
				{/if}
			{:else if log.log.woundedW1}
				{#if log.log.woundedW1 === 1}
					<div>Un zombie s'est approché un peu trop près et {log.player} a maintenant <Item item={wounds[1]} /></div>
				{:else if log.log.woundedW1 === 2}
					<div>Après un accrochage avec un zombie, {log.player} est maintenant <Item item={wounds[2]} /></div>
				{/if}
			{/if}
			{#if log.log.weapon === "Une grenade fumigène"}
				<div>Cette diversion lui permet de quitter la zone en toute sécurité.</div>
			{/if}
		</div>
	{:else if ['loot', 'building'].includes(log.action)}
		<div class="item">
			{log.player} a trouvé {log.action === 'building' ? 'dans le bâtiment' : ''}
			{#each sortItems(log.log.loots) as item}
				<span><Item {item} /></span>
			{/each}
		</div>
		{#if log.log.plus.one || log.log.plus.two || log.log.plus.tree || log.log.plus.four}
			{log.player} découvre
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
	{:else if log.action === 'new'}
		<div>L'agitation de la nuit a permis de dévoiler de nouvelles ressources...</div>
	{:else if log.action === 'pickup'}
		<div class="item">{log.player} a ramassé <span><Item item={log.log.item} /></span></div>
	{:else if log.action === 'drop'}
		<div class="item">{log.player} a déposé <span><Item item={log.log.item} /></span></div>
	{:else if log.action === 'heal'}
		<div>{log.player} s'est soigné avec {firstLetterToLowerCase(log.log.drug)}.</div>
    {:else if log.action === 'wound'}
        {#if log.log.wound === 1}
            <div class="item">En se réveillant ce matin, {log.player} était de nouveau <span><Item item={wounds[0]} /></span></div>
        {:else if log.log.wound === 2}
            <div class="item">En se réveillant ce matin, {log.player} se sentait <span><Item item={wounds[3]} /></span></div>
        {:else if log.log.wound === 3}
			<div class="item">Gravement blessé, {log.player} est <span><Item item={wounds[4]} /></span> ce matin...</div>
        {/if}
	{:else if log.action === 'feed'}
		<div>{log.player} a {log.log.type === 'food' ? 'mangé' : 'bu'} <span class={log.log.type}>{log.log.feed.toLowerCase()}</span> et a regagné {Math.floor(log.log.value)} PA.</div>
	{:else if log.action === 'force'}
		<div>Rassemblant son courage, {log.player} est passé en force et peut quitter la zone. Après une lutte acharnée, il est maintenant <Item item={wounds[2]} /></div>
	{:else if log.action === 'tchat'}
		<div>{log.player} : <i>{log.log.message}</i></div>
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
	}
	.item span:first-child {
		margin-left: 4px;
	}
	.item span:last-child {
		margin-right: 4px;
	}
	.food, .p1 {
		color: green;
	}
	.drink, .p2 {
		color: blue;
	}
	.p3 {
		color: purple;
	}
	.p4 {
		color: orange;
	}
</style>
