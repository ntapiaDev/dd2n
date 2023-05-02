<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { sortPlayers } from '$lib/game';
	import PlayerName from "../game/PlayerName.svelte";

    export let game;

    let color;
</script>

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
                <form method="POST" action="?/setPrivate" use:enhance>
                    <input type="text" name="game_id" value={game.id} hidden />
                    <button>{game.private ? 'Rendre public' : 'Rendre privé'}</button>
                </form>
            {/if}
        </form>
    </td>
</tr>

<style>
    td {
		padding: 0.5em 1em;
		border: 1px solid #aaa;
		text-align: center;
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
</style>
