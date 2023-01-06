<script>
    import { flip } from 'svelte/animate';
    import { sortItems } from '../../utils/tools';
	import Item from './Item.svelte';

	export let items;

    let size = 10; // Taille changeable si items de stockage (sac, etc) importés dans items.
</script>

<span class="inventory">
    <span class="title">Inventaire :</span>
    {#each sortItems(items) as item (item.uuid)}
        <span class="animation" animate:flip>         
            <Item {item} />            
        </span>
    {/each}
    {#each Array(size - items.length) as _}
        <span class="empty"></span>
    {/each}
    <span class="total">({items.length}/{size})</span>
</span>

<style>
    .inventory {
        display: inline-flex;
    }
    .title {
        display: flex;
        align-items: center;
        margin: 0 4px;
    }
    .animation {
        width: 25px;
        height: 25px;
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
