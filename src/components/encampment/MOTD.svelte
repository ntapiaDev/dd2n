<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from 'svelte';
	import { tooltip } from '../game/tooltip';

    export let message;
    export let urgent;

    const dispatch = createEventDispatcher();

    const handleClick = (id) => {
		dispatch('clicked', { id });
	}
</script>

{#if $page.data.user.username === message.username}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="owner" title="Modifier" on:click={() => handleClick(message.id)} use:tooltip>
        <h4>Message du jour ({message.username}) :</h4>
        <span>{message.message}</span>
    </div>
{:else}
    <div>
        <h4>Message du jour ({message.username}) :</h4>
        <span>{message.message}</span>
    </div>
{/if}

{#if urgent}
    {#each urgent as message}
        {#if $page.data.user.username === message.username}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="urgent owner" title="Modifier" on:click={() => handleClick(message.id)} use:tooltip>
                <h4>Message urgent ({message.username}) :</h4>
                <span>{message.message}</span>
            </div>
        {:else}
            <div class="urgent">
                <h4>Message urgent ({message.username}) :</h4>
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
    .urgent {
        margin-top: 1px;
        color: red;
    }
</style>
