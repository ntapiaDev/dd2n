<script>
	import { fade } from "svelte/transition";
    import { getDefense, isBlocked } from "$lib/worksites";
	import Worksite from './Worksite.svelte';

    export let encampment;
    export let worksites;
    
    $: completed = encampment.completed;
    $: [defense, temporary] = getDefense(completed, worksites);
    $: unlocked = encampment.unlocked.map(w => w.id);

    let total = 0;
    let totalUnlocked = 0;
    $: if (encampment) {
        total = totalUnlocked = 0;
        for (let groups of worksites) for (let worksite of groups.reduction) {
            total++;
            if ((!worksite.parent || encampment.completed.includes(worksite.parent) || encampment.unlocked.find(w => w.id === worksite.parent)) && encampment.unlocked.find(w => w.id === worksite.id)) totalUnlocked++;
        }
    }
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Chantiers de défense ({ `${encampment.completed.length} chantiers terminés, ${encampment.completed.length + totalUnlocked} chantiers sur ${total}` }) :</h3>
    <p>Vous pouvez trouver ici la liste des chantiers de défenses de votre campement.<br>
    Un chantier peut être construit si les ressources nécessaires sont entreposées dans la banque commune. Vous pourrez trouver de nouveaux plans au fil de vos aventures.
    </p>
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
                type="parent"
                worksite={parent} />
            {#each worksites.find(w => w.group === parent.id)?.reduction ?? [] as child}
                <Worksite
                    apLeft={encampment.unlocked.find(w => w.id === child.id)?.ap}
                    blocked={isBlocked(child, completed, worksites)}
                    completed={completed.includes(child.id)}
                    hidden={!unlocked.includes(child.id) && !completed.includes(child.id)}
                    type="child"
                    worksite={child} />
            {/each}
        {/if}
    {/each}
    <span class="misc">
        <span class="temporary">
            <span class="mark">!</span> : chantier temporaire, ne résistera pas à la nuit
        </span>
        <span class="defense">Total : <b>{defense}</b>
            {#if temporary}
                (+{temporary} <span class="mark">! </span>)
            {/if}
            DEF</span>
    </span>
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
    .header {
        display: grid;
        grid-template-columns: 5FR 11FR 3FR 1FR 1FR;
        font-weight: bold;
    }
    .header span {
        text-align: center;
    }
    .misc {
        display: flex;
        justify-content: space-between;
    }
    .temporary {
        margin: 0.5em 0 0 0.5em;
        color: rgb(100, 100, 100);
    }
    .temporary span,
    .defense span {
        color: red;
        font-weight: bold;
    }
    .defense {
        margin: 0.5em 0.5em 0 0;
    }
</style>
