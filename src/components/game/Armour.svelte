<script>
	import Slot from './Slot.svelte';

	export let items;
	export let slots;
</script>

<span class="armour">
	<span class="title">Protection :</span>
	<Slot name="A1" slot={slots.A1} {items} />
	<Slot name="A2" slot={slots.A2} {items} />
	<Slot name="A3" slot={slots.A3} {items} />
	<span class="total">{(slots.A1.defense ?? 0) + (slots.A2.defense ?? 0) + (slots.A3.defense ?? 0)} DEF</span>
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
	.total {
		display: flex;
		align-items: center;
		margin-left: 4px;
	}
</style>
