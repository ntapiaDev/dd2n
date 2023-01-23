<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Game from '../../components/website/Game.svelte';

	export let data;
	export let form;

	$: games = data.games;
</script>

<h1>Sélectionner une partie :</h1>
<section>
	<table>
		<tr>
			<th>Jour</th>
			<th>Nom</th>
			<th>Joueurs</th>
			<th>Action</th>
		</tr>
		{#each games as game}
			<Game {game} />
		{/each}
	</table>
	{#if $page.data.user.role === 'admin'}
		<div class="admin">
			<h2>Ajouter une partie :</h2>
			<form method="POST" action="?/addGame" use:enhance>
				<button>Ajouter une partie</button>
			</form>
		</div>
	{/if}
	{#if form?.admin}
		<p>Vous devez être administrateur pour effectuer cette action.</p>
	{:else if form?.already}
		<p>Vous êtes déjà dans une partie.</p>
	{:else if form?.color}
		<p>Cette couleur n'est pas disponible.</p>
	{:else if form?.taken}
		<p>Cette couleur est déjà prise.</p>
	{/if}
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		width: 75%;
		margin: 1em auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th {
		padding: 0.5em 1em;
		border: 1px solid #aaa;
		text-align: center;
	}
	th:nth-child(1) {
		width: 5%;
	}
	th:nth-child(2) {
		width: 45%;
	}
	th:nth-child(3) {
		width: 25%;
	}
	th:nth-child(4) {
		width: 25%;
	}
	.admin {
		margin-top: 1em;
	}
	h2 {
		margin-bottom: 0.5em;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	}
</style>
