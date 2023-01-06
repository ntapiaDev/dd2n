<script>
	import Item from "../../components/game/Item.svelte";

    const items = [
        {
            "attack": 0 ,
            "credit": "Freepik" ,
            "defense": 0 ,
            "description": "Un méchant zombie dévoreur de cerveau" ,
            "disease": 0 ,
            "hunger": 0 ,
            "icon": "zombie" ,
            "id": "09bbb34f-667a-48b8-afed-ce876ff4154c" ,
            "rarity": "commun" ,
            "thirst": 0 ,
            "type": "misc" ,
            "unique": false
        },
        {
            "attack": 1 ,
            "credit": "Freepik" ,
            "defense": 0 ,
            "description": "Une bouteille d'eau minérale" ,
            "disease": 0 ,
            "hunger": 0 ,
            "icon": "water" ,
            "id": "95e76f54-8ca9-4528-bcc0-3c159dde7c8b" ,
            "rarity": "commun" ,
            "thirst": 1 ,
            "type": "drink" ,
            "unique": false
        },
        {
            "attack": 5 ,
            "credit": "kosonicon" ,
            "defense": 0 ,
            "description": "Un pistolet de policier" ,
            "disease": 0 ,
            "hunger": 0 ,
            "icon": "gun" ,
            "id": "c278c863-00df-4e52-b283-d6affb244cda" ,
            "rarity": "inhabituel" ,
            "thirst": 0 ,
            "type": "weapon" ,
            "unique": false
        },
        {
            "attack": 1 ,
            "credit": "Smashicons" ,
            "defense": 2 ,
            "description": "Une veste en cuir" ,
            "disease": 0 ,
            "hunger": 0 ,
            "icon": "leather-jacket" ,
            "id": "9d8d44c9-6cb7-4b63-b820-8428785370c8" ,
            "rarity": "commun" ,
            "thirst": 0 ,
            "type": "armour" ,
            "unique": false
        },
        {
            "attack": 1 ,
            "credit": "smashingstocks" ,
            "defense": 0 ,
            "description": "Des planches de bois" ,
            "disease": 0 ,
            "hunger": 0 ,
            "icon": "wood-plank" ,
            "id": "a3eff481-3d59-40d4-b127-6a79ff748eb0" ,
            "rarity": "commun" ,
            "thirst": 0 ,
            "type": "resource" ,
            "unique": false
        }
    ];
</script>

<section>
    <div>
        <h1>Bienvenue sur Don't Die 2Nite!</h1>
        <p>Ce jeu est inpiré du jeu de survie <a href="http://www.die2nite.com" target="_blank" rel="noreferrer">Die2Nite</a> (<a href="http://www.hordes.fr" target="_blank" rel="noreferrer">Hordes</a> pour la version française) développé par Motion Twin en 2008.</p>
        <p>Le but du jeu : survivre le plus longtemps possible dans une ville envahie par les zombies <Item item={items[0]} />.</p>
        <p>Le jeu se déroule au tour par tour : vous disposez de 100 PA (points d'actions) afin d'explorer la zone qui vous entoure, ramasser de nouveaux objets (nourriture, armes, matériaux de construction) et mettre en place vos défenses. A la fin de chaque tour, une horde de zombies attaquera votre campement et vous devrez être bien préparé.</p>
        <p>Exemples d'objets que vous trouverez sur votre route : 
            <Item item={items[1]} />
            <Item item={items[2]} />
            <Item item={items[3]} />
            <Item item={items[4]} />
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
