<script>
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';
	import { sortItems } from '../../../utils/tools';
	import Attack from '../../../components/map/actions/Attack.svelte';
	import Drink from '../../../components/map/actions/Drink.svelte';
	import Eat from '../../../components/map/actions/Eat.svelte';
	import Encampment from '../../../components/map/actions/Encampment.svelte';
	import Heal from '../../../components/map/actions/Heal.svelte';
	import InteractiveItem from '../../../components/map/actions/InteractiveItem.svelte';
	import Map from '../../../components/map/Map.svelte';
	import MapLog from '../../../components/game/MapLog.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
	import Search from '../../../components/map/actions/Search.svelte';

	export let data;
	export let form;

	$: map = data.map;
	$: logs = data.logs;
	$: cell = map.rows[$page.data.user.i][$page.data.user.j];
	$: armour =
		($page.data.user.slots.A1.defense ?? 0) +
		($page.data.user.slots.A2.defense ?? 0) +
		($page.data.user.slots.A3.defense ?? 0);
	$: style =
		cell.zombies === 0 ? ' safe' :
		cell.zombies > 0 && cell.zombies <= armour ? ' warning' :
		cell.zombies > 0 && cell.zombies > armour ? ' danger' : '';
</script>

<h1>Vous êtes sur la case {$page.data.user.location} :</h1>
<section>
	<div class="map">
		<Map encampment={map.encampment} rows={map.rows} />
		<NextDay />
		<Reset />
	</div>
	<div class="cell">
		<div class={"people" + style}>
			{#if cell.coordinate === map.encampment}
				<span>Ceci est votre campement.</span>
				<span>Il résiste aux hordes de zombies, pour le moment...</span>
			{:else}
				<span>Il y a actuellement <b>{cell.zombies}</b> zombie{cell.zombies > 1 ? 's' : ''} sur la zone.</span>
				{#if cell.zombies === 0}
					<span>Profitez du calme, cela ne va sans doute pas durer...</span>
				{:else if cell.zombies > 0 && cell.zombies <= armour}
					<span>Votre armure de <b>{armour}</b> vous protège, vous pouvez progresser librement.</span>
				{:else if cell.zombies > 0 && cell.zombies > armour}
					<span>Votre armure de <b>{armour}</b> est trop faible : vous êtes bloqué !</span>
				{/if}
			{/if}
		</div>
		<div class="actions">
			<span class="title">Actions disponibles :</span>
			{#if $page.data.user.location === map.encampment}
				<Encampment />
			{/if}
			<Search />
			<Eat />
			<Drink />
			<Heal />
			{#if $page.data.user.slots.W1.attack}
				<Attack item={$page.data.user.slots.W1} />
			{:else}
				<Attack />
			{/if}
			{#if $page.data.user.slots.W2.attack && $page.data.user.slots.W2.weapon === $page.data.user.slots.W3.weapon}
				<Attack item={$page.data.user.slots.W2} />
			{/if}
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
		{#if form?.ammo}
			<p>Vous avez besoin de munitions pour utiliser cette arme.</p>
		{/if}
		{#if form?.exhausted}
			<p>Vous n'avez plus assez de points d'action.</p>
		{/if}
		{#if form?.full}
			<p>Votre inventaire est plein.</p>
		{/if}
		{#if form?.item}
			<p>Vous ne possédez pas cette arme ou celle-ci n'est pas équipée.</p>
		{/if}
		{#if form?.location}
			<p>Vous n'êtes pas sur la bonne case.</p>
		{/if}
		{#if form?.origin}
			<p>Cet objet n'est pas présent sur la case ou dans votre inventaire.</p>
		{/if}
		{#if form?.searched}
			<p>Vous avez déjà fouillé cette zone aujourd'hui.</p>
		{/if}
		{#if form?.wounded}
			<p>Vous êtes trop mal-en-point pour pouvoir vous battre au corps à corps.</p>
		{/if}
		{#if form?.zombies}
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
	.log {
		min-height: 45px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
	}
	.log {
		max-height: 500px;
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
