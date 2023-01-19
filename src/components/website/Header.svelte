<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Item from '../game/Item.svelte';

	const calendar = {
		credit: 'Erifqi Zetiawan',
		description: 'Combien de jours tiendrez-vous ?',
		icon: 'calendar',
		id: 'be91cda3-39b6-44e9-89c0-bd70b534435e',
		type: 'misc',
	};
	const stats = {
		credit: 'smashingstocks',
		description: 'Statistiques',
		icon: 'stats',
		id: 'dc030e8f-8b59-4fe5-8153-057ed1b38c17',
		type: 'misc',
	};

	$: title = $page.data.user?.game_id !== '80fcdf16-aaac-4cab-9b4b-7330132783d1' && $page.data.user?.day ?
		$page.data.user.day + ($page.data.user.day === 1 ? 'ère' : 'ème') + ' journée' :
		'Combien de jours tiendrez-vous ?';

	$: substitute = 'Objets trouvés : ' + $page.data.user?.stats.items + '<br/>' + 'Zombies tués : ' + $page.data.user?.stats.zombies;
</script>

<svelte:head>
    <title>Don't Die 2Nite - {title}</title> 
</svelte:head>

<header>
	<span class="date">
		<a href="/">Don't Die 2Nite.</a>
		{#if $page.data.user?.game_id}
			<span><Item item={calendar} /></span>
			<b>{#if $page.data.user.day === 0}
				En attente de partie
			{:else}
				{$page.data.user.day}{$page.data.user.day === 1 ? 'ère' : 'ème'} journée
			{/if}</b>
		{/if}
	</span>
	<nav>
		{#if !$page.data.user}
			<a href="/login">Connexion</a>
			<a href="/register">Enregistrement</a>
		{:else if $page.data.user}
			{#if $page.data.user.game_id}
				<a href="/map">Voir la carte</a>
			{/if}
			{#if $page.data.user.role === 'admin'}
				<a href="/admin">Administrer le site</a>
			{/if}
			<form method="POST" action="/logout" use:enhance>
				<button type="submit">Se déconnecter ({$page.data.user.username})</button>
			</form>
			<span class="stats"><Item item={stats} {substitute} /></span>
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
	.date {
		display: inline-flex;
		align-items: center;
	}
	.date span {
		margin-right: 4px;
	}
	.stats {
		margin-right: 0.5em;
	}
</style>
