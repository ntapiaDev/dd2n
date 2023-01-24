<script>
	import { flip } from 'svelte/animate';
	import { page } from '$app/stores';
	import { getDistance } from '$lib/game';
	import { sortItems } from '$lib/loots';
	import { getDefense } from '$lib/player';
	import Attack from '../../../components/map/actions/Attack.svelte';
	import Building from '../../../components/map/actions/Building.svelte';
	import Drink from '../../../components/map/actions/Drink.svelte';
	import Eat from '../../../components/map/actions/Eat.svelte';
	import Encampment from '../../../components/map/actions/Encampment.svelte';
	import Exit from '../../../components/map/actions/Exit.svelte';
	import Force from '../../../components/map/actions/Force.svelte';
	import Heal from '../../../components/map/actions/Heal.svelte';
	import Search from '../../../components/map/actions/Search.svelte';
	import Tchat from '../../../components/map/actions/Tchat.svelte';
	import Tunnel from '../../../components/map/actions/Tunnel.svelte';
	import Loots from '../../../components/map/Loots.svelte';
	import Map from '../../../components/map/Map.svelte';
	import MapLog from '../../../components/map/MapLog.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import InteractiveItem from '../../../components/game/InteractiveItem.svelte';
	import Item from '../../../components/game/Item.svelte';

	export let data;
	export let form;

	const human = {
		credit: "Freepik" ,
		description: "Un petit joueur tout innocent" ,
		icon: "human" ,
		id: "68604984-3955-466c-bfd0-af3b2a5710a3" ,
		type: "misc" ,
	};
	const walking = {
		credit: "surang" ,
		description: "Vous n'avez plus rien à faire ici" ,
		icon: "walking" ,
		id: "55473765-045d-4882-a2ba-d82fe93f97ab" ,
		type: "misc" ,
	};

	$: game = data.game;
	$: logs = data.logs;
	$: rows = data.rows;
	$: user = data.user;

	$: armour = getDefense(user.slots);
	$: cell = rows.find(row => row.find(c => c.coordinate === user.location)).find(c => c.coordinate === user.location);	
	$: style =
		cell.zombies === 0 ? ' safe' :
		cell.zombies > 0 && cell.zombies <= armour ? ' warning' :
		cell.zombies > 0 && cell.zombies > armour ? ' danger' : '';
	$: distance = getDistance(user.location, game.encampment);

	const getUsernames = (cell) => {
		let usernames = '';
		for (let username of cell.players.sort()) {
			const color = ($page.data.game.players.find(p => p.username === username)).color;
			usernames += (`<br/><span style="color: #FFF; text-shadow: 1px 0 0 ${color}, 1px 1px 0 ${color}, 0 1px 0 ${color}, -1px 1px 0 ${color}, -1px 0 0 ${color}, -1px -1px 0 ${color}, 0 -1px 0 ${color}, 1px -1px 0 ${color}">${username}</span>`);
		}
		return usernames;
	}
	$: substitute = `Joueurs sur la case (${cell.players.length}) :` + getUsernames(cell);

	let coordinates = [];
	let players = [];
	function showLoots(e) {
		coordinates = e.detail.coordinates;
	}
	function hideLoots() {
		coordinates = [];
	}
	function showPlayers(e) {
		players = e.detail.players;
	}
	function hidePlayers() {
		players = [];
	}
</script>

{#if user.role === 'admin'}
	<aside>
		<NextDay />
	</aside>
{/if}
<h1>Vous êtes sur la case {user.location} :</h1>
<section>
	<div class="map">
		<Map encampment={game.encampment} {rows} current={cell} {coordinates} {players} />
		<Loots {rows} on:showLoots={showLoots} on:hideLoots={hideLoots} on:showPlayers={showPlayers} on:hidePlayers={hidePlayers} />
	</div>
	<div class="cell">
		<div class={"people" + style}>
			{#if cell.coordinate === game.encampment}
				<span>Ceci est votre campement.</span>
				<span>Il résiste aux hordes de zombies, pour le moment...</span>
			{:else}
				{#if cell.building}
					<span>Vous remarquez <b>{cell.building.type.toLowerCase()}{cell.building.empty ? ' vide' : ''}</b> dans les parages{#if (cell.zombies > armour) && !cell.building.empty}{' mais son accès est bloqué par une horde de zombies'}{/if}.</span>
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
				{#if cell.entrance}
					<span>Cette zone abrite un <b>passage souterrain</b> menant vers une zone {cell.layout.danger === 2 ? 'dangereuse' : 'plus calme'}.</span>
				{/if}
			{/if}
			{#if cell.empty}
				<span><b>Cette zone est maintenant épuisée...</b></span>
			{/if}
		</div>
		<div class="actions">
			<span class="title">Actions disponibles :</span>
			{#if user.location === game.encampment}
				<Encampment />
			{:else if user.ap && cell.entrance}
				<Tunnel />
			{/if}
			{#if user.ap && !cell.searchedBy.includes(user.id) && !cell.empty}
				<Search />
			{/if}
			{#if user.ap && cell.building && !cell.building.searchedBy.includes(user.id) && !cell.building.empty && (cell.zombies <= armour)}
				<Building />
			{/if}
			{#if user.hunger <= 75 || (user.ap < 100 && user.inventory.some(i => i.ap && i.type ==='food'))}
				<Eat items={user.inventory} />
			{/if}
			{#if user.thirst <= 75 || (user.ap < 100 && user.inventory.some(i => i.ap && i.type ==='drink'))}
				<Drink items={user.inventory} />
			{/if}
			{#if user.wound || (user.ap < 100 && user.inventory.some(i => i.ap && i.type ==='drug'))}
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
			{#if (cell.zombies > armour) && !user.force && (user.wound < 2)}
				<Force />
			{/if}
			{#if (cell.searchedBy.includes(user.id) || cell.empty) && (!cell.building || cell.building.searchedBy.includes(user.id) || cell.building.empty) && user.hunger > 75 && user.thirst > 75 && (user.ap === 100 || !user.inventory.some(i => i.ap)) && !user.wound && !cell.zombies}
				<Item item={walking} />
			{/if}
			{#if user.location !== game.encampment}
				<span class="exit">
					<Exit {distance} />
				</span>
			{/if}
			<span class="players">
				<Item item={human} {substitute} quantity={cell.players.length} />
			</span>
		</div>
		<div class="items">
			<span class="title">Objets au sol ({cell.items.length}) :</span>
			{#each sortItems(cell.items) as item (item.uuid)}
				<span class="item" animate:flip>
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
			<Tchat {cell} />
		</div>
		{#if form?.access}
			<p>Il y a trop de zombies pour fouiller le bâtiment.</p>
		{:else if form?.ammo}
			<p>Vous avez besoin de munitions pour utiliser cette arme.</p>
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
		{:else if form?.encampment}
			<p>Il n'y a pas de campement dans cette zone.</p>
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
	aside {
		padding: 1em;
		position: absolute;
		top: 25px;
		left: 25px;
		border-radius: 1em;
		background-color: rgb(255, 255, 255, 0.25);
	}
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		margin: 1em;
		display: flex;
		flex-grow: 1;
		flex-basis: 50px;
		overflow-y: hidden;
	}
	.map,
	.cell {
		display: flex;
    	flex-direction: column;
	}
	.cell {
		width: 50%;
		margin-left: 1em;
		flex-grow: 1;
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
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
	}
	.actions,
	.items {
		display: grid;
		grid-template-columns: repeat(22, 1fr);
		gap: 1px 0;
	}
	.actions .exit,
	.actions .players {
		width: 25px;
		height: 25px;
		grid-column: 21 / 21;
	}
	.actions .players {
		grid-column: 22 / 22;
	}
	.actions .title,
	.items .title {
		height: 25px;
		grid-column: 1 / 7;		
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
	}
	.item {
		width: 25px;
		height: 25px;
	}
	.log {
		padding-top: 0.75em;
		overflow-y: auto;
	}
	.log .title {
		display: block;
		margin-bottom: 1em;
		text-decoration: underline;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	}
</style>
