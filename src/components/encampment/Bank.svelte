<script>
	import { fade } from "svelte/transition";

    export let items;
    $: console.log(items);
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Banque :</h3>
</div>

<style>
    div {
		padding: 0.5em;
        border: 1px solid #aaa;
		overflow-y: auto;
    }
    h3 {
        margin-bottom: 0.5em;
    }
</style>
