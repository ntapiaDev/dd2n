<script>
	import Slot from './Slot.svelte';

	export let interactive = true;
	export let items = [];
	export let W1;
	export let W2;
	export let W3;
	export let W4;
</script>

<span class="weapon">
	{#if interactive}
		<span class="title">ATK ({(W1.attack ?? 1)}/{(W2.attack && W2.weapon === W3.weapon ? W2.attack : 0)})</span>
	{/if}
	<Slot name="W1" slot={W1} {interactive} {items} />
	<Slot name="W2" slot={W2} {interactive} {items} />
	<Slot name="W3" slot={W3} {interactive} {items} />
	<Slot name="W4" slot={W4} {interactive} {items} />
</span>

<style>
	.weapon {
		display: inline-flex;
	}
	.title {
		display: flex;
		align-items: center;
		margin: 0 4px;
	}
</style>
