<script>
	import { fade } from "svelte/transition";

    let locked = true;
</script>

<div in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h3>Atelier de recyclage :</h3>
    <p>Cet atelier de recyclage vous permet de transformer vos ressources inutiles en matériaux de meilleure qualité. Il existe de nombreuses recettes, à vous de les trouver.</p>
    {#if locked}
        <span class="locked">L'atelier de recyclage n'a pas encore été débloqué.</span>
    {/if}
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
        margin-bottom: 0.5em;
    }
    .locked {
        font-weight: bold;
    }
</style>
