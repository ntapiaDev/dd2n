<script>
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';
	import { getDistance, sortItems } from '../../../utils/tools';
	import Attack from '../../../components/map/actions/Attack.svelte';
	import Building from '../../../components/map/actions/Building.svelte';
	import Drink from '../../../components/map/actions/Drink.svelte';
	import Eat from '../../../components/map/actions/Eat.svelte';
	import Encampment from '../../../components/map/actions/Encampment.svelte';
	import Force from '../../../components/map/actions/Force.svelte';
	import Heal from '../../../components/map/actions/Heal.svelte';
	import InteractiveItem from '../../../components/map/actions/InteractiveItem.svelte';
	import Item from '../../../components/game/Item.svelte';
	import Map from '../../../components/map/Map.svelte';
	import MapLog from '../../../components/game/MapLog.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
	import Search from '../../../components/map/actions/Search.svelte';
	import Tchat from '../../../components/map/actions/Tchat.svelte';
	import Tunnel from '../../../components/map/actions/Tunnel.svelte';

	export let data;
	export let form;

	$: map = data.map;
	$: logs = data.logs;
	$: user = $page.data.user;
	$: cell = map.rows[user.i][user.j];
	$: armour =
		(user.slots.A1.defense ?? 0) +
		(user.slots.A2.defense ?? 0) +
		(user.slots.A3.defense ?? 0);
	$: style =
		cell.zombies === 0 ? ' safe' :
		cell.zombies > 0 && cell.zombies <= armour ? ' warning' :
		cell.zombies > 0 && cell.zombies > armour ? ' danger' : '';

	// Futur bouton de retour automatique
	// $: distance = getDistance(user.location, map.encampment);

	const human = {
		attack: 0 ,
		credit: "Freepik" ,
		defense: 0 ,
		description: "Un petit joueur tout innocent" ,
		disease: 0 ,
		hunger: 0 ,
		icon: "human" ,
		id: "68604984-3955-466c-bfd0-af3b2a5710a3" ,
		rarity: "commun" ,
		thirst: 0 ,
		type: "misc" ,
		unique: false
	};
	const walking = {
		attack: 0 ,
		credit: "surang" ,
		defense: 0 ,
		description: "Vous n'avez plus rien à faire ici" ,
		disease: 0 ,
		hunger: 0 ,
		icon: "walking" ,
		id: "55473765-045d-4882-a2ba-d82fe93f97ab" ,
		rarity: "commun" ,
		thirst: 0 ,
		type: "misc" ,
		unique: false
	};

	const getUsernames = (cell) => {
		let usernames = '';
		for (let username of cell.players) usernames += ('<br/>' + username);
		return usernames;
	}
	$: players = `Joueurs sur la case (${cell.players.length}) :` + getUsernames(cell);
</script>

<h1>Vous êtes sur la case {user.location} :</h1>
<section>
	<div class="map">
		<Map encampment={map.encampment} rows={map.rows} current={cell} />
		<NextDay />
		<Reset />
	</div>
	<div class="cell">
		<div class={"people" + style}>
			{#if cell.coordinate === map.encampment}
				<span>Ceci est votre campement.</span>
				<span>Il résiste aux hordes de zombies, pour le moment...</span>
			{:else}
				{#if cell.building}
					<span>Vous remarquez <b>{cell.building.type.toLowerCase()}{cell.building.empty ? ' vide' : ''}</b> dans les parages{#if (cell.zombies > ((user.slots.A1.defense ?? 0) + (user.slots.A2.defense ?? 0) + (user.slots.A3.defense ?? 0))) && !cell.building.empty}{' mais son accès est bloqué par une horde de zombies'}{/if}.</span>
				{/if}
				<span>Il y a actuellement <b>{cell.zombies}</b> zombie{cell.zombies > 1 ? 's' : ''} sur la zone.</span>
				{#if cell.zombies === 0}
					<span>Profitez du calme, cela ne va sans doute pas durer...</span>
				{:else if cell.zombies > 0 && cell.zombies <= armour}
					<span>Votre armure de <b>{armour}</b> vous protège, vous pouvez progresser librement.</span>
				{:else if cell.zombies > 0 && cell.zombies > armour && !user.force}
					<span>Votre armure de <b>{armour}</b> est trop faible : vous êtes bloqué !</span>
				{:else if user.force}
					<span>Dépêchez-vous de partir d'ici avant de vous faire repérer !</span>
				{/if}
				{#if map.tunnel.includes(user.location)}
					<span>Cette zone abrite un <b>passage souterrain</b> menant vers une zone {cell.layout.danger === 2 ? 'dangereuse' : 'plus calme'}.</span>
				{/if}
			{/if}
			{#if cell.empty}
				<span><b>Cette zone est maintenant épuisée...</b></span>
			{/if}
		</div>
		<div class="actions">
			<span class="title">Actions disponibles :</span>
			{#if user.location === map.encampment}
				<Encampment />
			{:else if user.ap && map.tunnel.includes(user.location)}
				<Tunnel />
			{/if}
			{#if user.ap && !cell.searchedBy.includes(user.id) && !cell.empty}
				<Search />
			{/if}
			{#if user.ap && cell.building && !cell.building.searchedBy.includes(user.id) && !cell.building.empty && (cell.zombies <= ((user.slots.A1.defense ?? 0) + (user.slots.A2.defense ?? 0) + (user.slots.A3.defense ?? 0)))}
				<Building />
			{/if}
			{#if user.hunger <= 75}
				<Eat items={user.inventory} />
			{/if}
			{#if user.thirst <= 75}
				<Drink items={user.inventory} />
			{/if}
			{#if user.wound}
				<Heal items={user.inventory} wound={user.wound} />
			{/if}
			{#if user.ap && cell.zombies }
				{#if user.slots.W1.attack && user.wound <2}
					<Attack item={user.slots.W1} />
				{:else if user.wound <2}
					<Attack />
				{/if}
				{#if user.slots.W2.attack && user.slots.W2.weapon === user.slots.W3.weapon}
					<Attack item={user.slots.W2} />
				{/if}
				{#if user.slots.W4.attack}
					<Attack item={user.slots.W4} />
				{/if}
			{/if}
			{#if (cell.zombies > ((user.slots.A1.defense ?? 0) + (user.slots.A2.defense ?? 0) + (user.slots.A3.defense ?? 0))) && !user.force && (user.wound < 2)}
				<Force />
			{/if}
			<!-- Gérer le cas avec 0 PA en étant toujours sur la map -->
			{#if (cell.searchedBy.includes(user.id) || cell.empty) && (!cell.building || cell.building.searchedBy.includes(user.id) || cell.building.empty) && user.hunger > 75 && user.thirst > 75 && !user.wound && !cell.zombies}
				<Item item={walking} />
			{/if}
			<span class="players">
				<Item item={human} substitute={players} quantity={cell.players.length} />
			</span>
		</div>
		<div class="items">
			<span class="title">Objets au sol ({cell.items.length}) :</span>
			{#each sortItems(cell.items) as item (item.uuid)}
				<span animate:flip>
					<InteractiveItem {item} action={'/map?/pickUp'} />
				</span>
			{/each}
		</div>
		<div class="log">
			<span class="title">Historique de la zone :</span>
			{#each logs as log}
				<MapLog {log} />
			{/each}
		</div>
		<div class="tchat">
			<Tchat />
		</div>
		{#if form?.ammo}
			<p>Vous avez besoin de munitions pour utiliser cette arme.</p>
		{:else if form?.access}
			<p>Il y a trop de zombies pour fouiller le bâtiment.</p>
		{:else if form?.blocked}
			<p>Il y a trop de zombies pour pouvoir passer.</p>
		{:else if form?.building}
			<p>Il n'y a pas de bâtiment dans cette zone.</p>
		{:else if form?.clear}
			<p>Vous n'avez pas besoin de passer en force pour quitter la zone.</p>
		{:else if form?.direction}
			<p>Vous ne pouvez pas aller dans cette direction.</p>
		{:else if form?.empty}
			<p>Cette zone est épuisée.</p>
		{:else if form?.emptyBuilding}
			<p>Ce bâtiment est vide.</p>
		{:else if form?.exhausted}
			<p>Vous n'avez plus assez de points d'action.</p>
		{:else if form?.force}
			<p>Il serait trop dangereux de passer en force avec vos blessures.</p>
		{:else if form?.full}
			<p>Votre inventaire est plein.</p>
		{:else if form?.item}
			<p>Vous ne possédez pas cette arme ou celle-ci n'est pas équipée.</p>
		{:else if form?.long}
			<p>Votre message est trop long (100 caractères maximum).</p>
		{:else if form?.location}
			<p>Vous n'êtes pas sur la bonne case.</p>
		{:else if form?.origin}
			<p>Cet objet n'est pas présent sur la case ou dans votre inventaire.</p>
		{:else if form?.searched}
			<p>Vous avez déjà fouillé cette zone aujourd'hui.</p>
		{:else if form?.searchedBuilding}
			<p>Vous avez déjà fouillé ce bâtiment aujourd'hui.</p>
		{:else if form?.short}
			<p>Votre message est trop court (3 caractères minimum).</p>
		{:else if form?.tchat}
			<p>Vous avez déjà laissé un message dans cette zone aujourd'hui.</p>
		{:else if form?.tunnel}
			<p>Il n'y a pas de tunnel ici.</p>
		{:else if form?.wounded}
			<p>Vous êtes trop mal-en-point pour pouvoir vous battre au corps à corps.</p>
		{:else if form?.zombies}
			<p>Il n'y a pas de zombies à attaquer.</p>
		{/if}
	</div>
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		display: flex;
		margin: 1em;
	}
	.map {
		width: 45%;
	}
	.cell {
		width: 55%;
		margin-left: 1em;
	}
	.people {
		display: flex;
		flex-direction: column;
	}
	.safe {
		color: green;
	}
	.warning {
		color: orange
	}
	.danger {
		color: red
	}
	.actions,
	.items,
	.log,
	.tchat {
		min-height: 45px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
	}
	.actions .players {
		width: 25px;
		height: 25px;
		margin-left: auto;
	}
	.log {
		max-height: 480px;
		overflow-y: auto;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: baseline;
	}
	.title {
		margin-right: 4px;
	}
	.log .title {
		margin-bottom: 1em;
		text-decoration: underline;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	}
</style>
