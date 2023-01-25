<script>
	import { page } from '$app/stores';
	import Actions from '../../../components/encampment/Actions.svelte';
	import Attack from '../../../components/encampment/Attack.svelte';
	import Bank from '../../../components/encampment/Bank.svelte';
	import Navigate from '../../../components/encampment/Navigate.svelte';
	import Place from '../../../components/encampment/Place.svelte';
	import Players from '../../../components/encampment/Players.svelte';
	import Register from '../../../components/encampment/Register.svelte';
	import NextDay from '../../../components/map/NextDay.svelte';

	export let data;
	// export let form;

	$: encampment = data.encampment;
	$: user = $page.data.user;

	let selected = 'register';

	const open = (e) => selected = e.detail.open;
</script>

{#if user.role === 'admin'}
	<aside>
		<NextDay />
	</aside>
{/if}
<h1>Vous êtes dans votre campement :</h1>
<section>
	<div class="sidebar">
		<Attack />
		<Actions {user} />
		<Navigate {selected} on:clicked={open}/>
		<Players encampment={encampment.players} game={$page.data.game.players} lastDate={data.lastDate} />
	</div>
	<div class="content">
		{#if selected === 'register'}
			<Register logs={data.logs} />
		{:else if selected === 'place'}
			<Place />
		{:else if selected === 'bank'}
			<Bank items={encampment.items} />
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
	.content {
		margin-left: 1em;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	/* p {
		Inspiré de Bootstrap Alerts
		margin: 1rem 0 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	} */
</style>
