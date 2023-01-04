<script>
	import { map } from '../../../stores/map';
	import { user } from '../../../stores/user';
	import Map from '../../../components/map/Map.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
	import Search from '../../../components/map/actions/Search.svelte';

	export let data;

	$: map.set(data.map);
	// Simplifiable?? Trouver la bonne formule ReQL pour accéder à une case en particulier...
	$: row = $map.rows.find(row => row.find(c => c.coordinate === $user.location));
	$: cell = row.find(c => c.coordinate === $user.location);
	// $: rowNth = $map.rows.indexOf(row);
	// $: cellNth = row.indexOf(cell);
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
			<Search />
		</div>
		<div class="items">
			<span class="title">Objets au sol :</span>
			<!-- Ramasser et déposer un objet au clic sur l'objet -->
		</div>
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
		display: flex;
		align-items: center;
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
	}
	.title {
		margin-right: 4px;
	}
</style>
