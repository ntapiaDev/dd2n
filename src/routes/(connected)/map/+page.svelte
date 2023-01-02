<script>
	import Map from '../../../components/map/Map.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
    import { map } from '../../../stores/map';

	export let data;

    $: map.set(data);
</script>

<section>
	<Map encampment={$map.encampment} rows={$map.rows} days={$map.days} />
	<div>
		<NextDay power="1.1" />
		<NextDay power="1.5" />
		<NextDay power="2" />
	</div>
	<Reset />
</section>
