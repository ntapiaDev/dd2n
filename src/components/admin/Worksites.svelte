<script>
    import { enhance } from '$app/forms';
	import { fade } from "svelte/transition";
	import Item from '../game/Item.svelte';

    export let resources;
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
        <input type="text" name="name" placeholder="Nom" required />
        <select name="parent">
            <option value="">Parent</option>
        </select>
        <input type="number" min="1" max="100" name="ap" placeholder="AP" required />
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
    .resources {
        margin: 0.5em 0;
        display: flex;
        flex-wrap: wrap;
    }
    input[type=number] {
        width: 50px;
    }
    .resources input:not(:first-child) {
        margin-left: 3px;
    }
	input,
	select,
    button {
        width: 100px;
		text-align: center;
	}
    input[type=text],
    select:first-of-type {
        width: 231px;
    }
    h3 {
		margin-top: 0.5em;
	}
</style>
