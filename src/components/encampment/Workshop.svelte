<script>
	import { fade } from "svelte/transition";
	import Recipe from "./Recipe.svelte";
	import Upgrade from "./Upgrade.svelte";

    export let encampment;
    export let recipes;
    export let unlocked = false;
</script>

<div class="workshop" in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Atelier de recyclage ({ `${encampment.length} recettes sur ${recipes.length}` }) :</h3>
    <p>Cet atelier de recyclage vous permet de transformer vos ressources inutiles en matériaux de meilleure qualité. Il existe de nombreuses recettes, à vous de les trouver.</p>
    {#if !unlocked}
        <span class="locked">L'atelier de recyclage n'a pas encore été débloqué.</span>
    {:else}
        <div class="grid">
            {#each recipes as recipe}
                {#if encampment.includes(recipe.left.id)}
                    <Recipe {recipe} />
                {/if}
            {/each}
        </div>
        <Upgrade />
    {/if}
</div>

<style>
    div.workshop {
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
    .locked {
        font-weight: bold;
    }
    div.grid {
        margin-top: 1em;
        display: grid;
        grid-template-columns: repeat(4, 1FR);
        gap: 2px;
    }
</style>
