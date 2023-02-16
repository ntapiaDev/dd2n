<script>
    import { page } from '$app/stores';
	import { fade } from "svelte/transition";
	import Item from "../game/Item.svelte";
	import Meal from "./actions/Meal.svelte";
	import Worksite from "./Worksite.svelte";

    export let encampment;
    export let tavern;

    const item = {
        credit: 'Freepik',
        description: 'En travaux',
        icon: 'works',
        id: 'cc9e2ab5-d0bb-48e1-9499-757f44841ca7',
        type: 'misc'
    }
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Taverne "Le Never Dry" (niveau {encampment.level}) :</h3>
    <p>Bievenue dans la taverne "Le Never Dry" ! Vous pouvez venir manger et boire un verre une fois par jour, l'occasion de vous détendre et de passer un bon moment entre survivants.</p>
    <div class="img">
        <img src="./icons/loup.png" alt="Le Loup">
        <img src="./icons/ouink.png" alt="M. Ouink">
        <img src="./icons/agnes.png" alt="Agnès">
    </div>
    {#if encampment.level === 0}
        <div class="worksite"><Item {item} />La taverne est actuellement en construction...<Item {item} /></div>
        <div class="sign"></div>
    {:else if encampment.level > 0}
        {#if encampment.players.includes($page.data.user.username)}
            <p class="already">Vous avez déjà pris votre repas à la taverne aujourd'hui, mais vous pouvez toujours jouer avec Agnès, Le Loup et M. Ouink, cela leur ferait très plaisir !</p>
        {:else if $page.data.user.hunger > 75 && $page.data.user.thirst > 75}
            <p class="already">Vous n'avez pas faim du tout et vous sentez incapable d'avaler quoi que ce soit, mais vous pouvez toujours jouer avec Agnès, Le Loup et M. Ouink, cela leur ferait très plaisir !</p>
        {:else}
            <span class="meal">
                <img class="here" src="./here.png" alt="Cliquez-ici by itim2101">
                <Meal ap={encampment.level * 2} value={encampment.level * 10} />
                <img class="here reverse" src="./here.png" alt="Cliquez-ici by itim2101">
            </span>
            <span class="meal-infos">
                <span>Prendre un bon repas en si bonne compagnie</span>
                <p>La taverne de niveau {encampment.level} vous permet de récupérer +{encampment.level * 10}% de faim et de soif ainsi que {encampment.level * 2} PA.</p>
            </span>
        {/if}
    {/if}
    <span class="header">
        <span>Nom</span>
        <span>Ressources nécessaires</span>
        <span>PA restants</span>
        <span>LVL</span>
    </span>
    {#each tavern as worksite}
        <Worksite
            apLeft={encampment.unlocked.find(w => w.id === worksite.id)?.ap}
            blocked={encampment.level < worksite.level - 1}
            completed={encampment.completed.includes(worksite.id)}
            type={worksite.parent ? "child" : "parent"}
            {worksite} />
    {/each}
    <p class="caption">Chaque niveau de la taverne vous permet de vous nourrir et de boire davantage.</p>
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
    .worksite {
        width: 75%;
        margin: 1em auto 0 ;
        padding: 0.5em 1em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        border: 3px double red;
        background-color: rgb(255, 0, 0, 0.1);
        border-radius: 0.5em;
        color: red;
        font-weight: bold;
    }
    .sign {
        width: 50%;
        height: 50px;
        margin: 0 auto 1em;
        border: none;
        border-left: 3px solid red;
        border-right: 3px solid red;
    }
    .meal {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }
    .here,
    .here.reverse {
        width: 50px;
        height: 50px;
    }
    .here.reverse {
        -webkit-transform: scaleX(-1);
                transform: scaleX(-1);
    }
    .meal-infos {
        width: 100%;
        margin-top: -0.5em;
        display: inline-block;
        text-align: center;
    }
    .meal-infos p {
        text-decoration: underline;
    }
    .already {
        text-align: center;
        text-decoration: underline;
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
    .caption {
        margin: 0.5em 0 0;
        text-align: center;
    }
</style>
