<script>
    import { enhance } from '$app/forms';
	import { fade } from "svelte/transition";
	import MOTD from "./MOTD.svelte";
	import Trello from "./Trello.svelte";
    import Item from '../game/Item.svelte';

    export let square;
    $: tasks = square.filter(m => !['motd', 'urgent'].includes(m.category));

    const items = [
        {
            credit: 'Freepik',
            description: 'Laisser un message',
            icon: 'write',
            id: 'e6f9dc67-f4e1-4b66-8192-0b27fccce49e',
            type: 'misc',
        }, 
        {
            credit: 'Freepik' ,
            description: 'Supprimer' ,
            icon: 'delete' ,
            id: 'ee0b8712-8b2c-422b-9212-ec828042b3ef' ,
            type: 'misc'
        }
    ];

    let category = '';
    let deleteTask = false;
    let id = '';
    let message = '';
    let mode = '';

    $: substitute = mode === 'edit' ? 'Modifier le message' : 'Écrire un message';
    $: visible = (message.length >= 3) && (message.length <= 200);

    const edit = (e) => {
        id = e.detail.id;
        message = square.find(m => m.id === id).message;
        mode = 'edit';
        category = 'edit';
        visible = true;
    }
    const handleChange = () => {
        if (mode === 'edit') message = '';
        id = '';
        mode = category;
    }
    const reset = () => {
        category = '';
        deleteTask = false;
        id = '';
        message = '';
        mode = '';
        visible = false
    }
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Place du village ({ `${tasks.length === 0 ? 'Aucune' : tasks.length} tache${tasks.length > 1 ? 's' : ''} en attente` }{#if square.some(m => m.category === 'urgent')}
        {` et `}<span class="urgent">{`${square.filter(m => m.category === 'urgent').length} message${square.filter(m => m.category === 'urgent').length > 1 ? 's' : ''} urgent${square.filter(m => m.category === 'urgent').length > 1 ? 's' : ''}`}</span>{/if})
    :</h3>
    <p>Bienvenue sur la Place du village !<br>
    C'est ici que vous pourrez communiquer entre survivants et définir vos plans d'action.</p>
    <MOTD message={square.find(m => m.category === 'motd')} urgent={square.filter(m => m.category === 'urgent')} on:clicked={edit} />
    <Trello {tasks} on:clicked={edit} />
    <form method="POST" action="/encampment?/square" use:enhance={reset}>
        <select name="category" bind:value={category} on:change={handleChange} required>
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
        <input type="text" name="delete" bind:value={deleteTask} hidden>
        <input type="text" name="message" placeholder="Écrire un message (200 caractères maximum, 3 maximum par catégorie et 1 urgent)" minlength="3" maxlength="200" autocomplete="off" bind:value={message} required>
        {#if visible}
            <button transition:fade={{ duration: 500 }}>
                <Item item={items[0]} {substitute} />
            </button>
        {/if}
        {#if mode === 'edit'}
            <button transition:fade={{ duration: 500 }} on:click={() => deleteTask = true}>
                <Item item={items[1]} />
            </button>
        {/if}
    </form>
</div>

<style>
    div {
		padding: 0.5em;
        border: 1px solid #aaa;
		overflow-y: auto;
    }
    h3 {
        margin-bottom: 0.5em;
    }
    p {
        color: rgb(100, 100, 100);
        margin-bottom: 0.5em;
    }
    .urgent {
        color: red;
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
        text-align: center;
    }
    input {
		padding: 0.1em 0.5em;
		flex-grow: 1;
		border: none;
		border-bottom: 1px solid #AAA;
		outline: none;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
    button:first-of-type {
        margin-left: 0.5em;
    }
</style>
