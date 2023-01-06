<script>
	import Player from '../components/game/Player.svelte';
	import Footer from '../components/website/Footer.svelte';
	import Header from '../components/website/Header.svelte';

	export let data;
</script>

<main>
	<Header />
	{#if data.user}
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
		border: 1px solid black;
	}
</style>
