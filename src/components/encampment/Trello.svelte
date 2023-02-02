<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from 'svelte';
    import { tooltip } from '../game/tooltip';
	import Task from './Task.svelte';

    export let tasks;

    const dispatch = createEventDispatcher();

    const handleClick = (id) => {
		dispatch('clicked', { id });
	}
</script>

<div class="container">
    <div class="bank">
        <h4>Banque</h4>
        {#if tasks.filter(t => t.category === 'bank').length}
            {#each tasks.filter(t => t.category === 'bank') as task}
                {#if $page.data.user.username === task.username}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="owner" title="Modifier" on:click={() => handleClick(task.id)} use:tooltip>
                        <Task {task} />
                    </span>
                {:else}
                    <Task {task} />
                {/if}
            {/each}
        {:else}
            <div class="empty" title="Ajouter une tache" use:tooltip>
                <span class="info">Cliquez pour ajouter une tache</span>
                Aucune tache en attente.
            </div>
        {/if}
    </div>
    <div class="worksites">
        <h4>Chantiers</h4>
        {#if tasks.filter(t => t.category === 'worksites').length}
            {#each tasks.filter(t => t.category === 'worksites') as task}
                {#if $page.data.user.username === task.username}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="owner" title="Modifier" on:click={() => handleClick(task.id)} use:tooltip>
                        <Task {task} />
                    </span>
                {:else}
                    <Task {task} />
                {/if}
            {/each}
        {:else}
            <div class="empty" title="Ajouter une tache" use:tooltip>
                <span class="info">Cliquez pour ajouter une tache</span>
                Aucune tache en attente.
            </div>
        {/if}
    </div>
    <div class="workshop">
        <h4>Atelier</h4>
        {#if tasks.filter(t => t.category === 'workshop').length}
            {#each tasks.filter(t => t.category === 'workshop') as task}
                {#if $page.data.user.username === task.username}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="owner" title="Modifier" on:click={() => handleClick(task.id)} use:tooltip>
                        <Task {task} />
                    </span>
                {:else}
                    <Task {task} />
                {/if}
            {/each}
        {:else}
            <div class="empty" title="Ajouter une tache" use:tooltip>
                <span class="info">Cliquez pour ajouter une tache</span>
                Aucune tache en attente.
            </div>
        {/if}
    </div>
</div>

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
    .owner {
        cursor: pointer;
    }
    .empty {
        margin-top: 1.5em;
        position: relative;
		padding: 0.5em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0 0 0.5em 0.5em;
		background-color: #eee;
        text-align: center;
        cursor: pointer;
    }
    .info {
		width: 100%;
		position: absolute;
		top: -15px;
        left: 0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.12);
		border-radius: 1em 1em 0 0;
		font-size: 0.75em;
		background-color: #ddd;
        text-align: center;
		z-index: 5;
	}
</style>
