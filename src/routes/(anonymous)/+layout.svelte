<script>
	import Item from "../../components/game/Item.svelte";
</script>

<section>
    <div>
        <h1>Bienvenue sur Don't Die 2Nite!</h1>
        <p>Ce jeu est inpiré du jeu de survie <a href="http://www.die2nite.com" target="_blank" rel="noreferrer">Die2Nite</a> (<a href="http://www.hordes.fr" target="_blank" rel="noreferrer">Hordes</a> pour la version française) développé par Motion Twin en 2008.</p>
        <p>Le but du jeu : survivre le plus longtemps possible dans une ville envahie par les zombies <Item id="09bbb34f-667a-48b8-afed-ce876ff4154c" />.</p>
        <p>Le jeu se déroule au tour par tour : vous disposez de 100 PA (points d'actions) afin d'explorer la zone qui vous entoure, ramasser de nouveaux objets (nourriture, armes, matériaux de construction) et mettre en place vos défenses. A la fin de chaque tour, une horde de zombies attaquera votre campement et vous devrez être bien préparé.</p>
        <p>Exemples d'objets que vous trouverez sur votre route : 
            <Item id="95e76f54-8ca9-4528-bcc0-3c159dde7c8b" />
            <Item id="c278c863-00df-4e52-b283-d6affb244cda" />
            <Item id="9d8d44c9-6cb7-4b63-b820-8428785370c8" />
            <Item id="a3eff481-3d59-40d4-b127-6a79ff748eb0" />
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
