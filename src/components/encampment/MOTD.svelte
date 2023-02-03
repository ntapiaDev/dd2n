<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from 'svelte';
	import { tooltip } from '../game/tooltip';
    import PlayerName from '../game/PlayerName.svelte';

    export let message;
    export let urgent;

    const dispatch = createEventDispatcher();

    const handleClick = (id) => {
		dispatch('clicked', { id });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="owner" title="Modifier" on:click={() => handleClick(message.id)} use:tooltip>
    <h4>Message du jour <span class="notb">(<PlayerName username={message.username} color={message.color} />)</span> :</h4>
    <span>{message.message}</span>
</div>

{#if urgent}
    {#each urgent as message}
        {#if $page.data.user.username === message.username}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="urgent owner" title="Modifier" on:click={() => handleClick(message.id)} use:tooltip>
                <h4>Message urgent <span class="notb">(<PlayerName username={message.username} color={message.color} />)</span> :</h4>
                <span>{message.message}</span>
            </div>
        {:else}
            <div class="urgent">
                <h4>Message urgent <span class="notb">(<PlayerName username={message.username} color={message.color} />)</span> :</h4>
                <span>{message.message}</span>
            </div>
        {/if}
    {/each}
{/if}

<style>
    div {
        padding: 0.5em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.5em;
		background-color: #eee;
    }
    div.owner {
        cursor: pointer;
    }
    h4 {
        display: inline-block;
    }
    .notb {
        font-weight: normal;
    }
    .urgent {
        margin-top: 1px;
        color: red;
    }
</style>
