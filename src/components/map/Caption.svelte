<script>
	import { fly } from "svelte/transition";

    export let open = false;
</script>

{#if open}
    <aside transition:fly={{ y: -278, duration: 500 }}>
        <span class="title">Légende de la carte :</span>
        <div class="grid">
            <div class="td encampment">C</div><span>Campement</span>
            <div class="td current"></div><span>Case actuelle</span>
            <div class="td building"></div><span>Bâtiment</span>
            <div class="td empty-building"></div><span>Bâtiment vide</span>
            <div class="td tunnel"></div><span>Passage souterrain</span>
            <div class="td empty"></div><span>Case épuisée</span>
            <div class="td button"><button></button></div><span>Déplacement possible</span>
            <div class="td zombies">8</div><span>Nombre de zombies</span>
            <div class="td fog"></div><span>Zone à découvrir</span>
            <div class="td blur">4</div><span>Zone déjà visitée</span>
            <div class="td border"></div><span>Mur infranchissable</span>
            <div class="td inner">2</div><span>Zone calme</span>
            <div class="td middle">4</div><span>Zone intermédiaire</span>
            <div class="td outer">8</div><span>Zone dangereuse</span>
        </div>
    </aside>
{/if}

<style>
    aside {
        position: absolute;
        top: 30px;
        left: 30px;
        width: 418px;
        height: 278px;
        padding: 0.5em;
        background-color: #EEE;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
    .title {
        text-decoration: underline;
	}
    .grid {
        margin-top: 0.5em;
        display: grid;
        grid-template-columns: 1FR 6FR 1FR 6FR;
        gap: 0.5em;
        align-items: center;
    }
    .td {
		width: 26px;
		height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		text-shadow: 1px 0 0 #ddd, 1px 1px 0 #ddd, 0 1px 0 #ddd, -1px 1px 0 #ddd, -1px 0 0 #ddd, -1px -1px 0 #ddd, 0 -1px 0 #ddd, 1px -1px 0 #ddd;
	}
    .encampment {
		color: #fff;
		background-color: blue;
		text-shadow: 1px 0 0 rgb(48, 48, 48), 1px 1px 0 rgb(48, 48, 48), 0 1px 0 rgb(48, 48, 48), -1px 1px 0 rgb(48, 48, 48), -1px 0 0 rgb(48, 48, 48), -1px -1px 0 rgb(48, 48, 48), 0 -1px 0 rgb(48, 48, 48), 1px -1px 0 rgb(48, 48, 48);
	}
    .current {
		border: 3px double green;
	}
    .building {
		border: 3px solid green;
	}
	.empty-building {
		border: 3px dotted green;
	}
    .tunnel {
		border: 3px dashed green;
	}
    .empty {
        background-image: radial-gradient(green 1px, transparent 0);
  		background-size: 4px 4px;
		background-position: center;
	}
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    button {
		width: 24px;
		height: 24px;
        background-color: rgba(0, 128, 0, 0.25);
        border: 1px solid rgba(0, 128, 0, 0.48);
		cursor: pointer;
	}
    .zombies {
        background-color: rgb(255, 0, 0, 0.25);
    }
    .fog {
		background: content-box radial-gradient(rgb(100, 100, 100), rgb(128, 128, 128));
	}
	.blur {
		filter : blur(1px);
        background-color: rgb(255, 0, 0, 0.125);
	}
    .border {
        border-left: 3px solid green;
    }
    .inner,
    .middle,
    .outer {
        background-size: 4px 4px;
		background-position: center;
    }
    .inner {
        background-image: radial-gradient(green 1px, transparent 0);
        background-color: rgb(255, 0, 0, 0.0625);
        border-bottom: 3px solid green;
        border-left: 3px solid green;
    }
    .middle {
        background-image: radial-gradient(orange 1px, transparent 0);
        background-color: rgb(255, 0, 0, 0.125);
        border: 3px dashed orange;
    }
    .outer {
        background-image: radial-gradient(red 1px, transparent 0);
        background-color: rgb(255, 0, 0, 0.25);
        border-bottom: 3px solid red;
    }
</style>
