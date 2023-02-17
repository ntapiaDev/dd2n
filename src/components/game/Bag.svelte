<script>
    import { page } from '$app/stores';
    import { flip } from 'svelte/animate';
    import { fly } from 'svelte/transition';
    import { sortItems } from '$lib/loots';
    import { sidebar } from '../../stores/sidebar';
	import InteractiveItem from './InteractiveItem.svelte';
	import Item from './Item.svelte';

    export let interactive = true;
	export let items;
    export let size;
    export let type;
</script>

{#if size}
    <span class="bag" in:fly={{ y: -30, duration: 500 }}>
        {#if interactive}
            <span class="title">{type === 'bag1' ? "Sac" : "Bagage"}</span>
        {/if}
        {#each sortItems(items) as item (item.uuid)}
            <span class="animation" animate:flip>
                {#if $page.url.pathname === '/map'}
                    <InteractiveItem {item} action={'/map?/drop'} origin={type} /> 
                {:else if $page.url.pathname === '/encampment' && $sidebar === 'bank'}
                    <InteractiveItem {item} action={'/encampment?/deposit'} origin={type} />
                {:else}
                    <Item {item} />
                {/if}
            </span>
        {/each}
        {#each Array(size - items.length) as _}
            <span class="empty"></span>
        {/each}
        {#if interactive}
            <span class="total">({items.length}/{size})</span>
        {/if}
    </span>
{/if}

<style>
    .bag {
        display: inline-flex;
        padding: 0.25em 0.5em;
        background-color: #EEE;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 0 0 0.25em 0.25em;
    }
    .title {
        display: flex;
        align-items: center;
        margin: 0 4px;
        white-space: nowrap;
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
