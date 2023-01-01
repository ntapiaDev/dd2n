<script>
	import Map from '../../../components/map/Map.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';
	import Reset from '../../../components/map/Reset.svelte';
    import { map } from '../../../stores/map';

	export let data;

    $: map.set(data);
	$: encampment = $map.encampment;
	$: rows = $map.rows;
	$: days = $map.days;
</script>

<section>
	<Map {encampment} {rows} {days} />
	<div>
		<NextDay user_id={$map.user_id} power="1.1" />
		<NextDay user_id={$map.user_id} power="1.5" />
		<NextDay user_id={$map.user_id} power="2" />
	</div>
	<Reset user_id={$map.user_id}/>
</section>
