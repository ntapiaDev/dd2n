<script>
	import { enhance } from '$app/forms';
    import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import Item from '../../game/Item.svelte';

    const item = {
		credit: 'Freepik',
		description: 'Laisser un message',
		icon: 'write',
		id: 'e6f9dc67-f4e1-4b66-8192-0b27fccce49e',
		type: 'misc',
	};

    let message = '';
    $: visible = (message.length >= 3) && (message.length <= 100);
    $: if ($page.data.user.tchat.includes($page.data.user.location)) message = '';
</script>

{#if !$page.data.user.tchat.includes($page.data.user.location)}
    <form method="POST" action="/map?/tchat" on:submit={() => visible = false} use:enhance>
        <input type="text" name="message" placeholder="Laisser un message pour la postérité (100 caractères maximum et 1 par jour)" minlength="3" maxlength="100" autocomplete="off" bind:value={message}>
        {#if visible}
            <button transition:fade={{ duration: 500 }}>
                <Item {item} />
            </button>
        {/if}
    </form>
{:else} 
    <i>Vous pourrez laisser un autre message dans cette zone demain...</i>
{/if}

<style>
	form {
		width: 100%;
		height: 25px;
        display: flex;
        align-items: center;
	}
    input {
		padding: 0.1em 0.25em;
		flex-grow: 2;
		border: none;
		border-bottom: 1px solid #AAA;
		outline: none;
	}
	button {
        margin-left: 0.5em;
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
