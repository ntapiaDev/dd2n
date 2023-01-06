<script>
    import { sortItems } from '../../utils/tools';
	import Item from './Item.svelte';

	export let items;
    $: sortItems(items);

    let size = 10; // Taille changeable si items de stockage (sac, etc) importés dans items.
</script>

<span class="inventory">
    <span class="title">Inventaire :</span>
    {#each Array(size) as _, i}
        {#if items[i]}
            <Item id={items[i].id} />
        {:else}
            <span class="empty"></span>
        {/if}
    {/each}
    <span class="total">({items.length}/{size})</span>
</span>

<style>
    .inventory {
        display: flex;
    }
    .title {
        display: flex;
        align-items: center;
        margin: 0 4px;
    }
    .empty {
        width: 25px;
        height: 25px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        border-radius: .25em;
    }
    .total {
        display: flex;
        align-items: center;
        margin-left: 4px;
    }
</style>
