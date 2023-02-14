<script>
	import { fade } from "svelte/transition";

    export let level;
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Taverne "Le Never Dry" (niveau {level}) :</h3>
    <p>Bievenue dans la taverne "Le Never Dry" ! Vous pouvez venir manger et boire un verre une fois par jour, l'occasion de vous détendre et de passer un bon moment entre survivants.</p>
    <div class="img">
        <img src="./icons/loup.png" alt="Le Loup">
        <img src="./icons/ouink.png" alt="M. Ouink">
        <img src="./icons/agnes.png" alt="Agnès">
    </div>
    {#if level === 0}
        <p class="worksite">La taverne est actuellement en construction...</p>
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
    .img {
        display: flex;
        justify-content: space-around;
        border: none;
    }
    img {
        width: 200px;
    }
    .worksite {
        margin-top: 1em;
        text-align: center;
    }
</style>
