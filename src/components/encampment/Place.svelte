<script>
	import { fade } from "svelte/transition";
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Place du village :</h3>
    <p>Bienvenue sur la Place du village !<br>
    C'est ici que vous pourrez communiquer entre survivants et définir vos plans d'action.</p>
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
</style>
