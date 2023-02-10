<script>
    import { sortPlayers } from '$lib/game';
    import { tooltip } from '../game/tooltip';
	import PlayerName from "../game/PlayerName.svelte";

    export let encampment;
    export let game;
    export let lastDate;

    const online = (player) => (Date.now() - lastDate.find(p => p.group === player)?.reduction) / 1000 <= 300;
</script>

<aside>
    <p>Joueurs dans le campement ({ encampment.length }) :</p>
    <ul>
        {#each encampment.sort() as player}
            <li>
                <span class={online(player) ? 'online' : 'offline'} title={online(player) ? 'En ligne' : 'Inactif'} use:tooltip></span>
                <PlayerName color={game.find(p => p.username === player)?.color} username={player} />
            </li>
        {/each}
    </ul>
    <p>Joueurs dans la nature ({ game.filter(p => !encampment.includes(p.username)).length }) :</p>
    <ul>
        {#each sortPlayers(game.filter(p => !encampment.includes(p.username))) as player}
            <li>
                <span class={online(player.username) ? 'online' : 'offline'} title={online(player.username) ? 'En ligne' : 'Inactif'} use:tooltip></span>
                <PlayerName color={player.color} username={player.username} />
            </li>
        {/each}
        {#if !game.filter(p => !encampment.includes(p.username)).length}
            Tout le monde est à l'intérieur.
        {/if}
    </ul>
    <a href="/players">Voir la liste détaillée</a>
</aside>

<style>
    aside {
        margin-top: 0.5em;
		padding: 0.5em;
        border: 1px solid #aaa;
	}
    p {
        text-decoration: underline;
    }
    ul {
        margin: 0.5em 0;
        list-style: none;
    }
    li + li {
        margin-top: 0.25em;
    }
    span {
        width: 8px;
        height: 8px;
        margin: 0 0.25em;
        position: relative;
        top: -1px;
        display: inline-block;
        border-radius: 50%;
    }
    span.online {
        background-color: green;
        box-shadow: 0 2px 4px rgba(0, 128, 0, 0.48), 1px 1px 4px rgba(0, 128, 0, 0.9);
    }
    span.offline {
        background-color: red;
        box-shadow: 0 2px 4px rgba(255, 0, 0, 0.48), 1px 1px 4px rgba(255, 0, 0, 0.9);
    }
    a {
        display: flex;
        justify-content: center;
        color: rgb(100, 100, 100);
    }
    a:visited {
        color: rgb(100, 100, 100);
    }
</style>
