<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getLevel } from '$lib/player';
	import { tooltip } from '../game/tooltip';
	import Item from '../game/Item.svelte';
	import PlayerName from '../game/PlayerName.svelte';

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

	$: title = $page.data.user?.game_id ?
		$page.data.game.day + ($page.data.game.day === 1 ? 'ère' : 'ème') + ' journée' :
		'Combien de jours tiendrez-vous ?';

	$: s = $page.data.user?.stats;
	$: substitute = 'Repas avalé' + (s?.food > 1 ? 's' : '') + ' : ' + (s?.food ?? 0) + '<br/>' +
		'Boisson' + (s?.drink > 1 ? 's' : '') + ' consommée' + (s?.drink > 1 ? 's' : '') + ' : ' + (s?.drink ?? 0) + '<br/>' +
		'Médicament' + (s?.drug > 1 ? 's' : '') + ' utilisé' + (s?.drug > 1 ? 's' : '') + ' : ' + (s?.drug ?? 0) + '<br/>' +
		'Participation aux chantiers : ' + (s?.worksite ?? 0) + ' PA<br/>' +
		'Objet' + (s?.workshop > 1 ? 's' : '') + ' transformé' + (s?.workshop > 1 ? 's' : '') + ' : ' + (s?.workshop ?? 0) + '<br/>' +
		'Objet' + (s?.items > 1 ? 's' : '') + ' trouvé' + (s?.items > 1 ? 's' : '') + ' : ' + (s?.items ?? 0) + '<br/>' +
		'Plan' + (s?.blueprint > 1 ? 's' : '') + ' trouvé' + (s?.blueprint > 1 ? 's' : '') + ' : ' + (s?.blueprint ?? 0) + '<br/>' +
		'Recette' + (s?.recipe > 1 ? 's' : '') + ' trouvée' + (s?.recipe > 1 ? 's' : '') + ' : ' + (s?.recipe ?? 0) + '<br/>' +
		'Expérience gagnée : ' + (s?.xp ?? 0) + ' xp<br/>' +
		'Zombie' + (s?.zombies > 1 ? 's' : '') + ' tué' + (s?.zombies > 1 ? 's' : '') + ' : ' + (s?.zombies ?? 0)
</script>

<svelte:head>
    <title>Don't Die 2Nite - {title}</title> 
</svelte:head>

<header>
	<span class="date">
		<a href="/">Don't Die 2Nite.</a>
		{#if $page.data.user}
			<span><Item item={calendar} /></span>
			<b>{#if $page.data.user.game_id}
				{$page.data.game.day}{$page.data.game.day === 1 ? 'ère' : 'ème'} journée
			{:else}
				En attente de partie
			{/if}</b>
		{/if}
	</span>
	<nav>
		{#if !$page.data.user}
			<a href="/login">Connexion</a>
			<a href="/register">Enregistrement</a>
		{:else if $page.data.user}
			{#if $page.data.user.game_id}
				{#if $page.data.user.location === 'Encampment'}
					<a href="/encampment">Voir le campement</a>
				{:else if $page.data.user.location !== 'Encampment'}
					<a href="/map">Voir la carte</a>
				{/if}
				<a href="/players">Liste des joueurs</a>
			{/if}
			{#if $page.data.user.role === 'admin'}
				<a href="/admin">Administrer le site</a>
			{/if}
			<form method="POST" action="/logout" use:enhance>
				<button type="submit">Se déconnecter ({#if $page.data.user.game_id}<PlayerName color={$page.data.user.color} username={`${$page.data.user.username} - `} /><span title={`${getLevel($page.data.user.xp).progress}%`} use:tooltip><PlayerName color={$page.data.user.color} username={`Niv. ${getLevel($page.data.user.xp).level}`} /></span>{:else}{$page.data.user.username}{/if})</button>
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
