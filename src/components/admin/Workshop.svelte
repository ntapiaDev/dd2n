<script>
	import { enhance } from '$app/forms';
    import { fade } from "svelte/transition";
	import Item from '../game/Item.svelte';

    export let recipes;
    export let resources;
    $: console.log(recipes);
</script>

<div class="workshop" in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h2>Ajouter une recette :</h2>
    <form method="POST" action="?/addRecipe" use:enhance>
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
        <div class="recipe">
            <select name="result">
                <option value="">Résultat</option>
                {#each resources as resource}
                    <option value={resource.id}>{resource.description}</option>
                {/each}
            </select>
            <select name="unlocked" required>
                <option value="locked">À débloquer</option>
                <option value="unlocked">Débloqué</option>
            </select>
            <button type="submit">Ajouter</button>
        </div>
    </form>
    <h2>Liste des recettes () :</h2>
    <div class="list">

    </div>
</div>

<style>
    .workshop {
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
    select:first-of-type {
        width: 230px;
    }
    select {
        width: 150px;
    }
    button {
        width: 100px;
    }
    .list {
        width: 735px;
        padding: 0.5em;
    }
</style>
