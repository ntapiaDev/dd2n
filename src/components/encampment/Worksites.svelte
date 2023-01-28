<script>
	import { fade } from "svelte/transition";
    import { getDefense, isBlocked } from "$lib/worksites";
	import Worksite from './Worksite.svelte';

    export let encampment;
    export let worksites;
    
    $: completed = encampment.completed;
    $: unlocked = encampment.unlocked.map(w => w.id);

    $: defense = getDefense(completed, worksites);
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Chantiers de défense :</h3>
    <span class="header">
        <span>Nom</span>
        <span>Ressources nécessaires</span>
        <span>PA restants</span>
        <span>DEF</span>
    </span>
    {#each worksites[0].reduction as parent}
        {#if unlocked.includes(parent.id) || completed.includes(parent.id)}
            <Worksite
                apLeft={encampment.unlocked.find(w => w.id === parent.id)?.ap}
                completed={completed.includes(parent.id)}
                type="parent" worksite={parent} />
            {#each worksites.find(w => w.group === parent.id)?.reduction ?? [] as child}
                <Worksite
                    apLeft={encampment.unlocked.find(w => w.id === child.id)?.ap}
                    blocked={isBlocked(child, completed, worksites)}
                    completed={completed.includes(child.id)}
                    hidden={!unlocked.includes(child.id) && !completed.includes(child.id)}
                    type="child" worksite={child} />
            {/each}
        {/if}
    {/each}
    <span class="defense">Total : <b>{defense}</b> DEF</span>
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
    .defense {
        margin: 0.5em 0.5em 0 0;
        display: block;
        text-align: end;
    }
</style>
