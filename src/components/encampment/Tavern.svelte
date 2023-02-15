<script>
	import { fade } from "svelte/transition";
	import Worksite from "./Worksite.svelte";

    export let encampment;
    export let tavern;
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Taverne "Le Never Dry" (niveau {encampment.level}) :</h3>
    <p>Bievenue dans la taverne "Le Never Dry" ! Vous pouvez venir manger et boire un verre une fois par jour, l'occasion de vous détendre et de passer un bon moment entre survivants.</p>
    <div class="img">
        <img src="./icons/loup.png" alt="Le Loup">
        <img src="./icons/ouink.png" alt="M. Ouink">
        <img src="./icons/agnes.png" alt="Agnès">
    </div>
    <div class="meal">
        <p>Chaque niveau de la taverne permet de récupérer davatange de points de faim et de soif.</p>
    </div>
    <span class="header">
        <span>Nom</span>
        <span>Ressources nécessaires</span>
        <span>PA restants</span>
        <span>LVL</span>
    </span>
    {#each tavern as worksite}
        <Worksite
            apLeft={encampment.unlocked.find(w => w.id === worksite.id).ap}
            blocked={encampment.level < worksite.level - 1}
            completed={encampment.completed.find(w => w.id === worksite.id)}
            type={worksite.parent ? "child" : "parent"}
            {worksite} />
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
        margin-bottom: 0.5em;
    }
    .img {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: none;
    }
    img {
        width: 200px;
    }
    img:nth-child(3) {
        width: 190px;
        height: 190px;
    }
    .header {
        margin-top: 0.5em;
        display: grid;
        grid-template-columns: 5FR 11FR 3FR 1FR 1FR;
        font-weight: bold;
    }
    .header span {
        text-align: center;
    }
</style>
