<script>
	import { fade } from "svelte/transition";
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Place du village :</h3>
</div>

<style>
    div {
        width: 50%;
        margin-left: 1em;
		padding: 0.5em;
        flex-grow: 1;
        border: 1px solid #aaa;
	}
    h3 {
        margin-bottom: 0.5em;
    }
</style>
