<script>
	import Slot from './Slot.svelte';

	export let items;
	export let W1;
	export let W2;
	export let W3;
</script>

<span class="weapon">
	<span class="title">Armes ({(W1.attack ?? 0)}/{(W2.attack && W2.weapon === W3.weapon ? W2.attack : 0)}) :</span>
	<Slot name="W1" slot={W1} {items} />
	<Slot name="W2" slot={W2} {items} />
	<Slot name="W3" slot={W3} {items} />
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
