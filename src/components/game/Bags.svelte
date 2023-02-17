<script>
	import Slot from './Slot.svelte';

	export let B1;
	export let B2;
	export let bag1;
	export let bag2;
	export let interactive = true;
	export let items = [];

    $: equiped = (B1 ? 1 : 0) + (B2 ? 1 : 0);
</script>

<span class="bag">
	<Slot 
		name="B1"
		slot={B1}
		interactive={items.some(i => i.capacity >= bag1.length && i.slot === B1.slot) || bag1?.length === 0}
		items={B1 ? items.filter(i => i.capacity >= bag1.length && i.slot === B1.slot) : items} />
	<Slot
		name="B2"
		slot={B2}
		interactive={items.some(i => i.capacity >= bag2.length && i.slot === B2.slot) || bag2?.length === 0}
		items={B2 ? items.filter(i => i.capacity >= bag2.length && i.slot === B2.slot) : items} />
	{#if interactive}
    	<span class="title">({equiped}/2)</span>
	{/if}
</span>

<style>
	.bag {
		display: inline-flex;
        margin-left: 0.5em;
	}
	.title {
		display: flex;
		align-items: center;
		margin: 0 4px;
	}
</style>
