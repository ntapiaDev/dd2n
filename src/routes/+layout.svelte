<script>
	import Footer from '../components/website/Footer.svelte';
	import Header from '../components/website/Header.svelte';
	import Player from '../components/game/Player.svelte';

	export let data;
</script>

<main>
	<Header />
	{#if data.user?.game_id !== 'd95363b8-cf62-4115-8e02-4b1398f7d109'}
		<Player />
	{/if}
	<slot />
	<Footer />
</main>

<style>
	main {
		max-width: 1080px;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		margin: auto;
		background-color: #fff;
		border: 1px solid black;
	}
</style>
