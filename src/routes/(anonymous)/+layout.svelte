<script>
	import Item from "../../components/game/Item.svelte";
    
    export let data;
    let items = data.items;
    items.sort(() => Math.random() > 0.5 ? 1 : -1)
</script>

<section>
    <div>
        <h1>Bienvenue sur Die2Nite - Reborn!</h1>
        <p>Ce jeu est inpiré du jeu de survie <a href="http://www.die2nite.com" target="_blank" rel="noreferrer">Die2Nite</a> (<a href="http://www.hordes.fr" target="_blank" rel="noreferrer">Hordes</a> pour la version française) développé par Motion Twin en 2008.</p>
        <p>Le but du jeu : survivre le plus longtemps possible dans une ville envahie par les zombies <Item id="09bbb34f-667a-48b8-afed-ce876ff4154c" />.</p>
        <p>Le jeu se déroule au tour par tour : vous disposez de 100 PA (points d'actions) afin d'explorer la zone qui vous entoure, ramasser de nouveaux objets (nourriture, armes, matériaux de construction) et mettre en place vos défenses. A la fin de chaque journée, une horde de zombies attaquera votre abris et vous devrez donc être bien préparé.</p>
        <p>Exemple d'objets que vous rencontrerez sur votre route : 
            {#each Array(5) as _, i}
                <Item id={items[i].id} />
            {/each}
        .</p>
        <p>A venir : peut-être un mode multijoueur...</p>
    </div>
    <div>
        <slot />
    </div>
</section>

<style>
    section {
        display: flex;
        margin-top: 5em;
    }
    div {
        width: 50%;
        padding: 1em;
    }
    h1 {
        text-align: center;
    }
    p {
        margin-top: 1em;
    }
</style>
