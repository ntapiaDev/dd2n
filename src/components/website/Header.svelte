<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Item from '../game/Item.svelte';

	// Statistiques
	$: title = 'Objets trouvés : ' + $page.data.user.stats.items + '<br/>' + 'Zombies tués : ' + $page.data.user.stats.zombies;
	const stats = {
		attack: 0,
		credit: 'smashingstocks',
		defense: 0,
		description: 'Statistiques',
		icon: 'stats',
		id: 'dc030e8f-8b59-4fe5-8153-057ed1b38c17',
		rarity: 'commun',
		type: 'misc',
		unique: false
	};
</script>

<header>
	<a href="/">Don't Die 2Nite.</a>
	<nav>
		{#if !$page.data.user}
			<a href="/login">Connexion</a>
			<a href="/register">Enregistrement</a>
		{:else if $page.data.user}
			<a href="/map">Voir la carte</a>
			{#if $page.data.user.role === 'admin'}
				<a href="/admin">Administrer le site</a>
			{/if}
			<form method="POST" action="/logout" use:enhance>
				<button type="submit">Se déconnecter ({$page.data.user.username})</button>
			</form>
			<span class="stats"><Item item={stats} {title} /></span>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		border: 1px solid black;
		background-color: #fff;
		z-index: 100;
	}
	nav {
		display: flex;
		align-items: center;
	}
	form {
		display: inline-block;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
	a,
	button {
		display: inline-block;
		padding: 0.5em;
		color: black;
		text-decoration: none;
	}
	.stats {
		margin-right: 0.5em;
	}
</style>
