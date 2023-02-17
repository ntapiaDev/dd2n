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

    $: width = (type === 'bag1' ? 85 : 115) + (size * 25) + (items.length > 9 ? 6 : 0) + (size > 9 ? 6 : 0);
</script>

{#if size}
    <span class="bag" style={`width: ${width}px`} in:fly={{ y: -30, duration: 500 }}>
        <span class="container">
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
        </span>
        {#if interactive}
            <span class="total">({items.length}/{size})</span>
        {/if}
    </span>
{/if}

<style>
    .bag {
        display: inline-flex;
        justify-content: space-between;
        padding: 0.25em 0.5em;
        background-color: #EEE;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 0 0 0.25em 0.25em;
    }
    .container {
        display: inline-flex;
    }
    .title {
        display: flex;
        align-items: center;
        margin-right: 4px;
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
    }
</style>
