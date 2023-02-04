<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { checkResources, getQuantity } from "$lib/worksites";
	import Item from "../game/Item.svelte";

    export let recipe;

    const items = [
        {
            credit: 'Freepik',
            description: 'Transformer',
            icon: 'transform',
            id: '5617997b-dfca-4955-a8a7-724729fc8e9e',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Ressources nécessaires',
            icon: 'tools',
            id: '2cb48047-0ecb-4ace-9334-042e7d97a181',
            type: 'misc'
        }
    ];

    $: bank = $page.data.encampment?.items ?? [];
</script>

<div class={'recipe ' + recipe.left.rarity}>
    <span class="resources">
        {#each recipe.left.resources as resource}
            <span class={'resource ' + (getQuantity(bank, resource) >= resource.quantity ? 'valid' : 'failed')}>
                {getQuantity(bank, resource)}/{resource.quantity} <Item item={resource.item} />
            </span>
        {/each}
    </span>
    <div class="submit">
        {#if checkResources(bank, recipe.left.resources, 1, false, false)}
            <form method="POST" action="/encampment?/workshop" use:enhance>
                <input type="text" name="ap" value={recipe.left.ap} hidden>
                <input type="text" name="id" value={recipe.left.id} hidden>
                <button>
                    <Item item={items[0]} border={recipe.left.ap > $page.data.user.ap ? 'red' : ''} />
                </button>
            </form>
        {:else}
            <Item item={items[1]} background="#DDD" />
        {/if}
    </div>
    <span class="result">
        <Item item={recipe.right} quantity={recipe.left.quantity} /><span class={recipe.left.ap <= $page.data.user.ap ? 'valid' : 'failed'}>{recipe.left.ap} PA</span>
    </span>
</div>

<style>
    div.recipe {
        padding: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
    }
    .resources {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1px;
    }
    .resource,
    .result {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .failed {
        color: red;
    }
    .valid {
        color: green;
    }
    .submit {
        margin: 0 0.25em;
    }
    form {
		width: 25px;
		height: 25px;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}

    div.inhabituel {
		box-shadow: 0 0 3px rgba(0, 128, 0, 0.66), 0 2px 4px rgba(0, 128, 0, 0.66);
	}
	div.rare {
		box-shadow: 0 0 3px rgba(0, 0, 255, 0.66), 0 2px 4px rgba(0, 0, 255, 0.66);
	}
	div.épique {
		box-shadow: 0 0 3px rgba(128, 0, 128, 0.66), 0 2px 4px rgba(128, 0, 128, 0.66);
	}
	div.légendaire {
		box-shadow: 0 0 3px rgba(255, 165, 0, 0.66), 0 2px 4px rgba(255, 165, 0, 0.66);
	}
</style>
