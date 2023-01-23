<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { sortPlayers } from '$lib/game';
	import PlayerName from '../../components/map/PlayerName.svelte';

	export let data;
	export let form;

	let color;

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
			{#if game.name !== 'Lobby'}
				<tr>
					<td>{game.day}</td>
					<td>{game.name}</td>
					<td>
						{#if game.players.length}
							{#each sortPlayers(game.players) as player}
								<div><PlayerName color={player.color} username={player.username} /></div>
							{/each}
						{:else}
							<div>En attente de joueurs</div>
						{/if}
					</td>
					<td>
						<form method="POST" action="?/joinGame" use:enhance>
							<input type="text" name="game_id" value={game.id} hidden />
							{#if !$page.data.user.game_id}
								<label for="color">Votre couleur :</label>
								<select id="color" name="color" style={`background-color: ${color}`} bind:value={color}>
									{#each game.colors as color}
										{#if !color.taken}
											<option value={color.code} style={`background-color: ${color.code}`}>{color.name}</option>
										{/if}
									{/each}
								</select>
								<button>Rejoindre la partie</button>
							{:else if $page.data.user.game_id === game.id}
								<button>Quitter la partie</button>
							{/if}
							{#if $page.data.user.role === 'admin'}
								<form method="POST" action="?/deleteGame" use:enhance>
									<input type="text" name="game_id" value={game.id} hidden />
									<button>Supprimer</button>
								</form>
							{/if}
						</form>
					</td>
				</tr>
			{/if}
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
	th,
	td {
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
	select {
		display: block;
		text-align: center;
		outline: none;
	}
	select,
	option {
		color: #EEE
	}
	select,
	button {
		width: 100%;
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
