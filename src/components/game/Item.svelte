<script>
    import { page } from '$app/stores';
    import { items } from '../../stores/items';
    import { tooltip } from './tooltip';

    export let id;

    $: item = $items.find(i => i.id === id);

    $: type =
        item.attack > 1 ? "weapon" :
        item.defense >= 1 ? "armour" :
        item.hunger === 1 ? "food" :
        item.thirst === 1 ? "drink" :
        item.disease === 1 ? "drug" :
        item.type === "resource" ? "resource" :
        item.type === "blueprint" ? "blueprint" : "misc";
    $: rarity =
        item.rarity === 1 ? "magique" :
        item.rarity === 2 ? "rare" :
        item.rarity === 3 ? "épique" : "normal";
</script>

<span class="{type} {rarity}">
    <!-- Remplacer par BASEURI ou équivalent?? -->
    <img src={$page.url.origin + "/icons/" + item.icon + ".png"} 
        alt={item.icon + ' icon by ' + item.credit}
        title={item.description + (rarity !== "normal" ? ` (${rarity})` : "") + (item.unique ? " (unique)" : "")}
        use:tooltip>
    {#if item.unique}
        <img src={$page.url.origin + "/star.png"} alt="Objet unique by Kemalmoe" class="unique">
    {/if}
</span>

<style>
    span {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 25px;
        height: 25px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        border-radius: .25em;
        /* cursor: pointer; */
    }
    img {
        width: 20px;
        height: 20px;
    }

    /* Type */
    .weapon {
        background-color: rgb(255, 205, 205);
    }
    .armour {
        background-color: rgb(255, 225, 205);
    }
    .food {
        background-color: rgb(205, 255, 205);
    }
    .drink {
        background-color: rgb(205, 255, 255);
    }
    .drug {
        background-color: rgb(255, 255, 205);
    }
    .resource {
        background-color: rgb(255, 225, 155);
    }
    .blueprint {
        background-color: rgb(255, 205, 255);
    }

    /* Rarity */
    .magique {
        border: 1px solid green;
    }
    .rare {
        border: 1px solid blue;
    }
    .épique {
        border: 1px solid purple;
    }

    /* Unique */
    .unique {
        width: 12px;
        height: 12px;
        position: absolute;
        top: 0px;
        right: 0px;
    }
</style>
