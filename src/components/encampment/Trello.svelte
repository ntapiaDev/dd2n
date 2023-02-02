<script>
    import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Item from '../game/Item.svelte';
	import Task from './Task.svelte';

    export let tasks;

    const item = {
		credit: 'Freepik',
		description: 'Écrire un message',
		icon: 'write',
		id: 'e6f9dc67-f4e1-4b66-8192-0b27fccce49e',
		type: 'misc',
	};

    let category = '';
    let id = undefined;
    let mode = 'add';

    let message = '';
    $: visible = (message.length >= 3) && (message.length <= 200);

    $: if (mode === 'edit') category = mode;
</script>

<div class="container">
    <div class="bank">
        <h4>Banque</h4>
        {#each tasks.filter(t => t.category === 'bank') as task}
            <Task {task} />
        {/each}
    </div>
    <div class="worksites">
        <h4>Chantiers</h4>
        {#each tasks.filter(t => t.category === 'worksites') as task}
            <Task {task} />
        {/each}
    </div>
    <div class="workshop">
        <h4>Atelier</h4>
        {#each tasks.filter(t => t.category === 'workshop') as task}
            <Task {task} />
        {/each}
    </div>
</div>
<form method="POST" action="/encampment?/square" on:submit={() => visible = false} use:enhance>
    <select name="category" bind:value={category} required>
        <option value="">Catégorie</option>
        <option value="bank">Banque</option>
        <option value="worksites">Chantiers</option>
        <option value="workshop">Atelier</option>
        <option value="urgent">Urgent</option>
        {#if mode === 'edit'}
            <option value="edit">Édition</option>
        {/if}
    </select>
    <input type="text" name="id" bind:value={id} hidden>
    <input type="text" name="message" placeholder="Écrire un message (200 caractères maximum, 3 maximum par catégorie et 1 urgent)" minlength="3" maxlength="200" autocomplete="off" bind:value={message} required>
    {#if visible}
        <button transition:fade={{ duration: 500 }}>
            <Item {item} />
        </button>
    {/if}
</form>

<style>
    .container {
        margin-top: 0.5em;
        display: grid;
        grid-template-columns: repeat(3, 1FR);
        gap: 0.5em;
    }
    h4 {
        text-align: center;
    }
    form {
        margin-top: 1em;
		width: 100%;
		height: 25px;
        display: flex;
        align-items: center;
	}
    select {
        border: 1px solid #AAA;
    }
    input {
		padding: 0.1em 0.5em;
		flex-grow: 1;
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
