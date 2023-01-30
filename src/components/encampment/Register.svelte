<script>
    import { page } from '$app/stores';
	import { fade } from "svelte/transition";
	import EncampmentLog from "./EncampmentLog.svelte";

    export let logs;
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Registre central ({$page.data.game.name} - jour {$page.data.game.day}) :</h3>
    <p>Toutes les actions qui ont lieu dans l'enceinte du campement sont répertoriées dans le registre central. Vous y trouverez également tous les jours le compte-rendu de l'attaque.</p>
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
    p {
        color: rgb(100, 100, 100);
        margin-bottom: 1em;
    }
</style>
