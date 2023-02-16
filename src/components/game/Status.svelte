<script>
	import Hunger from "./Hunger.svelte";
	import Thirst from "./Thirst.svelte";
	import Wound from "./Wound.svelte";
</script>

<span class="status">
	<Wound />
	<Hunger />
	<Thirst />
</span>

<style>
	.status {
		display: inline-flex;
	}
</style>
