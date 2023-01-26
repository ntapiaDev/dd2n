<script>
	import { fade } from "svelte/transition";
</script>

<div class="workshop" in:fade|local={{ delay: 150, duration: 300}} out:fade|local={{ duration: 150}}>
    <h2>Ajouter une recette :</h2>
</div>

<style>
    .workshop {
        overflow-y: auto;
    }
</style>
