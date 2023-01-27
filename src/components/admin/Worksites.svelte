<script>
    import { enhance } from '$app/forms';
	import { fade } from "svelte/transition";
	import Item from '../game/Item.svelte';

    export let resources;
    export let worksites;
    $: console.log(worksites);
</script>

<div class="worksites" in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h2>Ajouter un chantier :</h2>
    <form method="POST" action="?/addWorksite" use:enhance>
        <h4>Ressources communes :</h4>
        <div class="resources">
            {#each resources.filter(r => r.rarity === 'commun') as item}
                <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                <Item {item} />
            {/each}
        </div>
        <h4>Ressources inhabituelles :</h4>
        <div class="resources">
            {#each resources.filter(r => r.rarity === 'inhabituel') as item}
                <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                <Item {item} />
            {/each}
        </div>
        <h4>Ressources rares :</h4>
        <div class="resources">
            {#each resources.filter(r => r.rarity === 'rare') as item}
                <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                <Item {item} />
            {/each}
        </div>
        <h4>Ressources épiques :</h4>
        <div class="resources">
            {#each resources.filter(r => r.rarity === 'épique') as item}
                <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                <Item {item} />
            {/each}
        </div>
        <div class="description">
            <input type="text" name="name" placeholder="Nom" required />
            <select name="parent">
                <option value="">Parent</option>
                {#each worksites.filter(w => !w.parent) as worksite}
                    <option value={worksite.id}>{worksite.name}</option>
                {/each}
            </select>
        </div>
        <div class="infos">
            <select name="unlocked" required>
                <option value="locked">À débloquer</option>
                <option value="unlocked">Débloqué</option>
            </select>
            <select name="completed" required>
                <option value="uncompleted">En cours</option>
                <option value="completed">Terminé</option>
            </select>
            <input type="number" min="1" max="100" name="ap" placeholder="AP" />
            <input type="number" min="1" max="100" name="defense" placeholder="DEF" required />
            <select name="rarity" required>
                <option value="">Rareré</option>
                <option value="commun">Commun</option>
                <option value="inhabituel">Inhabituel</option>
                <option value="rare">Rare</option>
                <option value="épique">Épique</option>
                <option value="légendaire">Légendaire</option>
            </select>
            <button type="submit">Ajouter</button>
        </div>
    </form>
    <h2>Liste des chantiers () :</h2>
    <h3>Chantiers communs :</h3>
</div>

<style>
    .worksites {
        overflow-y: auto;
    }
    form {
		margin: 1em 0;
	}
    input,
	select {
		text-align: center;
	}
    .resources {
        margin: 0.5em 0;
        display: flex;
        flex-wrap: wrap;
    }
    .resources input:not(:first-child) {
        margin-left: 3px;
    }
    input[type=number] {
        width: 50px;
    }
    .description input,
    .description select {
        width: 230px;
    }
    .infos {
        margin-top: 0.5em;
    }
    .infos select, button {
        width: 100px;
    }
    .infos select:nth-child(1) {
        width: 150px;
    }
    h3 {
		margin-top: 0.5em;
	}
</style>
