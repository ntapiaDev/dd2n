<script>
	import { fade } from "svelte/transition";
	import EncampmentLog from "./EncampmentLog.svelte";

    export let logs;
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Registre :</h3>
    {#each logs as log}
        <EncampmentLog {log} />
    {/each}
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
