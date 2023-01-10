<script>
	import Hunger from "./Hunger.svelte";
	import Thirst from "./Thirst.svelte";
	import Wound from "./Wound.svelte";
</script>

<span class="status">
	<span class="title">Statut :</span>
	<Wound />
	<Hunger />
	<Thirst />
</span>

<style>
	.status {
		display: inline-flex;
	}
	.title {
		display: flex;
		align-items: center;
		margin: 0 4px;
	}
</style>
