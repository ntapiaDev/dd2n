<script>
	import { enhance } from '$app/forms';
    import { fade } from "svelte/transition";
	import Recipe from '../encampment/Recipe.svelte';
	import Item from '../game/Item.svelte';

    export let items;
    export let recipes;
    export let workshop;
</script>

<div class="workshop" in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h2>Ajouter une recette :</h2>
    <form method="POST" action="?/addRecipe" use:enhance>
        <h4>Ressources communes :</h4>
        <div class="resources">
            {#each items.filter(r => r.rarity === 'commun' && !r.origin) as item}
                <span>
                    <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                    <Item {item} />
                </span>
            {/each}
        </div>
        <h4>Ressources inhabituelles :</h4>
        <div class="resources">
            {#each items.filter(r => r.rarity === 'inhabituel' && !r.origin) as item}
                <span>
                    <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                    <Item {item} />
                </span>
            {/each}
        </div>
        <h4>Ressources rares :</h4>
        <div class="resources">
            {#each items.filter(r => r.rarity === 'rare' && !r.origin) as item}
                <span>
                    <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                    <Item {item} />
                </span>
            {/each}
        </div>
        <h4>Ressources épiques :</h4>
        <div class="resources">
            {#each items.filter(r => r.rarity === 'épique' && !r.origin) as item}
                <span>
                    <input type="number" min="1" max="100" name={item.id} placeholder="0" />
                    <Item {item} />
                </span>
            {/each}
        </div>
        <div class="recipe">
            <select name="result">
                <option value="">Résultat</option>
                {#each items as item}
                    <option value={item.id}>{item.description}</option>
                {/each}
            </select>
            <input type="number" min="1" max="100" name="quantity" placeholder="Quantité" />
            <select name="unlocked" required>
                <option value="locked">À débloquer</option>
                <option value="unlocked">Débloqué</option>
            </select>
            <button type="submit">Ajouter</button>
        </div>
    </form>
    <h2>Liste des recettes ({workshop.length}) :</h2>
    <div class="list">
        <div class="grid">
            {#each recipes as recipe}
                <Recipe {recipe} />
            {/each}
        </div>
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
        gap: 3px;
    }
    .resources span {
        display: flex;
        align-items: center;
    }
    input[type=number] {
        width: 50px;
    }
    .recipe input[type=number] {
        width: 104px;
    }
    select:first-of-type {
        width: 231px;
    }
    select {
        width: 152px;
    }
    button {
        width: 125px;
    }
    .list {
        width: 735px;
        margin-top: 0.5em;
        padding: 0.5em;
        border: 1px solid #aaa;
    }
    div.grid {
        display: grid;
        grid-template-columns: repeat(4, 1FR);
        gap: 2px;
    }
</style>
