<script>
    import { page } from '$app/stores';
	import { fade } from "svelte/transition";
	import Worksite from './Worksite.svelte';

    export let worksites;
    
    $: completed = $page.data.game.worksites.completed;
    $: unlocked = $page.data.game.worksites.unlocked;
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Chantiers de défense :</h3>
    <span class="header">
        <span>Nom</span>
        <span>Ressources nécessaires</span>
        <span>PA</span>
        <span>DEF</span>
    </span>
    {#each worksites[0].reduction as parent}
        {#if unlocked.includes(parent.id) || completed.includes(parent.id)}
            <Worksite completed={completed.includes(parent.id)} type="parent" worksite={parent} />
            {#each worksites.find(w => w.group === parent.id)?.reduction ?? [] as child}
                <Worksite completed={completed.includes(child.id)} hidden={!unlocked.includes(child.id) && !completed.includes(child.id)} type="child" worksite={child} />
            {/each}
        {/if}
    {/each}
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
    .header {
        display: grid;
        grid-template-columns: 5FR 11FR 3FR 1FR 1FR;
    }
    .header span {
        text-align: center;
    }
</style>
