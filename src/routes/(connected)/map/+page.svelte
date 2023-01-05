<script>
	import { map } from '../../../stores/map';
	import { user } from '../../../stores/user';
	import { sortItems } from '../../../utils/tools';
	import Item from '../../../components/game/Item.svelte';
	import Map from '../../../components/map/Map.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
	import Search from '../../../components/map/actions/Search.svelte';

	export let data;
	export let form;

	$: map.set(data.map);
	// Simplifiable?? Trouver la bonne formule ReQL pour accéder à une case en particulier... (+doublon +page.server.js)
	$: cell = $map.rows.find(row => row.find(c => c.coordinate === $user.location)).find(c => c.coordinate === $user.location);
</script>

<h1>Vous êtes sur la case {$user.location} :</h1>
<section>
	<div class="map">
		<Map encampment={$map.encampment} rows={$map.rows} days={$map.days} />
		<div>
			<NextDay power="1.1" />
			<NextDay power="1.5" />
			<NextDay power="2" />
		</div>
		<Reset />
	</div>
	<div class="cell">
		<div class="people">
			<span>Zombies sur la zone : {cell.zombies}</span>
		</div>
		<div class="actions">
			<span class="title">Actions disponibles :</span>
			{#if $user.location !== $map.encampment}
				<Search />
			{/if}
		</div>
		<div class="items">
			<span class="title">Objets au sol :</span>
			{#each sortItems(cell.items) as { id }}
				<Item {id} />
			{/each}
			<!-- Ramasser et déposer un objet au clic sur l'objet -->
		</div>
		{#if form?.searched}
			<p>Vous avez déjà fouillé cette zone aujourd'hui.</p>
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
	.actions,
	.items {
		min-height: 45px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
	}
	.title {
		margin-right: 4px;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0;
		padding: .75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: .25rem;
	}
</style>
