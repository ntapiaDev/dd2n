<script>
	import Slot from './Slot.svelte';

	export let interactive = true;
	export let items = [];
	export let B1;
	export let B2;

    $: equiped = (B1 ? 1 : 0) + (B2 ? 1 : 0);
</script>

<span class="bag">
	<Slot name="B1" slot={B1} {interactive} {items} />
	<Slot name="B2" slot={B2} {interactive} {items} />
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
