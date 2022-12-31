<script>
	// import Player from '../components/game/Player.svelte';
	import Footer from '../components/website/Footer.svelte';
	import Header from '../components/website/Header.svelte';
	// import { player } from '../stores/player';

	export let data;

	// $: player.set(data.user);
</script>

<main>
	<Header />
	{#if data.user}
		<!-- <Player /> -->
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
