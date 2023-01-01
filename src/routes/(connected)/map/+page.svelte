<script>
	import Map from '../../../components/map/Map.svelte';
	// import NextDay from '../../../components/map/NextDay.svelte';
	// import Reset from '../../../components/map/Reset.svelte';

	export let data;
	let encampment = data.encampment;
	let rows = data.rows;
	let days = data.days;

	// const nextDay = (e) => {
	// 	rows = e.detail.rows;
	// 	days = e.detail.days;
	// };

	// const reset = (e) => {
	// 	encampment = e.detail.encampment;
	// 	rows = e.detail.rows;
	// 	days = e.detail.days;
	// };
</script>

<section>
	<Map {encampment} {rows} {days} />
	<!-- <div>
		<NextDay power="1.1" on:nextDay={nextDay} />
		<NextDay power="1.5" on:nextDay={nextDay} />
		<NextDay power="2" on:nextDay={nextDay} />
	</div> -->
	<!-- <Reset on:reset={reset} user_id={data.user_id}/> -->
</section>
