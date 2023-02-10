<script>
	import Slot from './Slot.svelte';

	export let interactive = true;
	export let items = [];
	export let A1;
	export let A2;
	export let A3;
</script>

<span class="armour">
	{#if interactive}
		<span class="title">DEF ({(A1.defense ?? 0) + (A2.defense ?? 0) + (A3.defense ?? 0)})</span>
	{/if}
	<Slot name="A1" slot={A1} {interactive} {items} />
	<Slot name="A2" slot={A2} {interactive} {items} />
	<Slot name="A3" slot={A3} {interactive} {items} />
</span>

<style>
	.armour {
		display: inline-flex;
	}
	.title {
		display: flex;
		align-items: center;
		margin: 0 4px;
	}
</style>
