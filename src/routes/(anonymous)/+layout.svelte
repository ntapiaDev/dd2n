<script>
	import Item from "../../components/game/Item.svelte";

    const items = [
        {
            "credit": "Freepik" ,
            "description": "Un méchant zombie dévoreur de cerveau" ,
            "icon": "zombie" ,
            "id": "09bbb34f-667a-48b8-afed-ce876ff4154c" ,
            "type": "misc" ,
        },
        {
            "code": "b1" ,
            "credit": "Freepik" ,
            "description": "Une bouteille d'eau minérale" ,
            "icon": "water" ,
            "id": "95e76f54-8ca9-4528-bcc0-3c159dde7c8b" ,
            "rarity": "commun" ,
            "type": "drink" ,
            "unique": false ,
            "value": 50
        },
        {
            "attack": 5 ,
            "code": "b5" ,
            "credit": "kosonicon" ,
            "description": "Un pistolet de policier" ,
            "icon": "gun" ,
            "id": "c278c863-00df-4e52-b283-d6affb244cda" ,
            "rarity": "inhabituel" ,
            "slot": "W2" ,
            "type": "weapon" ,
            "unique": false ,
            "weapon": "gun"
        },
        {
            "credit": "Smashicons" ,
            "defense": 2 ,
            "description": "Une veste en cuir" ,
            "icon": "leather-jacket" ,
            "id": "9d8d44c9-6cb7-4b63-b820-8428785370c8" ,
            "rarity": "commun" ,
            "slot": "A2" ,
            "type": "armour" ,
            "unique": false
        },
        {
            "code": "b2" ,
            "credit": "smashingstocks" ,
            "description": "Des planches de bois" ,
            "icon": "wood-plank" ,
            "id": "a3eff481-3d59-40d4-b127-6a79ff748eb0" ,
            "rarity": "commun" ,
            "type": "resource" ,
            "unique": false
        }
    ];
</script>

<section>
    <div>
        <h1>Bienvenue sur Don't Die 2Nite!</h1>
        <p>Ce jeu est inpiré du jeu de survie <a href="http://www.die2nite.com" target="_blank" rel="noreferrer">Die2Nite</a> (<a href="http://www.hordes.fr" target="_blank" rel="noreferrer">Hordes</a> pour la version française) développé par Motion Twin en 2008.</p>
        <p>Le but du jeu : survivre le plus longtemps possible dans une ville envahie par les zombies <Item item={items[0]} /></p>
        <p>Le jeu se déroule au tour par tour : vous disposez de 100 PA (points d'action) afin d'explorer la zone qui vous entoure, ramasser de nouveaux objets (nourriture, armes, matériaux de construction) et mettre en place vos défenses. A la fin de chaque tour, une horde de zombies attaquera votre campement et vous devrez être bien préparé.</p>
        <p>Exemples d'objets que vous trouverez sur votre route : 
            <Item item={items[1]} />
            <Item item={items[2]} />
            <Item item={items[3]} />
            <Item item={items[4]} />
        </p>
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
