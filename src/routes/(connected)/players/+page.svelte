<script>
    import { getDefense } from "$lib/player";
	import Armour from "../../../components/game/Armour.svelte";
    import Hunger from "../../../components/game/Hunger.svelte";
	import Inventory from "../../../components/game/Inventory.svelte";
    import PlayerName from "../../../components/game/PlayerName.svelte";
	import Thirst from "../../../components/game/Thirst.svelte";
	import Weapon from "../../../components/game/Weapon.svelte";
	import Wound from "../../../components/game/Wound.svelte";

    export let data;
    $: players = data.players;
</script>

<h1>Liste des joueurs :</h1>
<section>
    <table>
        <tr>
            <th>Nom</th>
            <th>Statuts</th>
            <th>Équipement</th>
            <th>Inventaire</th>
            <th>Emplacement</th>
            <th>DEF</th>
            <th>PA</th>
        </tr>
        {#each players as player}
            <tr style={`background-color: ${player.color + '20'}`}>
                <td><PlayerName username={player.username} color={player.color} /></td>
                <td class="status">
                    <div>
                        <Wound wound={player.wound} />
                        <Hunger hunger={player.hunger} />
                        <Thirst thirst={player.thirst} />
                    </div>
                </td>
                <td class="equip">
                    <span><Weapon W1={player.slots.W1} W2={player.slots.W2} W3={player.slots.W3} W4={player.slots.W4} interactive={false} /></span>
                    <Armour A1={player.slots.A1} A2={player.slots.A2} A3={player.slots.A3} interactive={false} />
                </td>
                <td><Inventory items={player.inventory} interactive={false} /></td>
                <td>{player.location === 'Encampment' ? 'Campement' : player.location}</td>
                <td>{getDefense(player.slots)}</td>
                <td>{player.ap}</td>
            </tr>
        {/each}
    </table>
    <h2>Statistiques détaillés :</h2>
    <table>
        <tr>
            <th>Nom</th>
            <th>Repas</th>
            <th>Boissons</th>
            <th>Médicaments</th>
            <th>Chantiers</th>
            <th>Atelier</th>
            <th>Objet trouvés</th>
            <th>Plans</th>
            <th>Recettes</th>
            <th>Zombies</th>
        </tr>
        {#each players as player}
            <tr style={`background-color: ${player.color + '20'}`}>
                <td><PlayerName username={player.username} color={player.color} /></td>
                <td>{player.stats.food}</td>
                <td>{player.stats.drink}</td>
                <td>{player.stats.drug}</td>
                <td>{player.stats.worksite} PA</td>
                <td>{player.stats.workshop}</td>
                <td>{player.stats.items}</td>
                <td>{player.stats.blueprint}</td>
                <td>{player.stats.recipe}</td>
                <td>{player.stats.zombies}</td>
            </tr>
        {/each}
    </table>
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		min-height: 600px;
		margin: 1em auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
    td {
		padding: 0.5em 1em;
		border: 1px solid #aaa;
		text-align: center;
	}
    td.status div {
        display: flex;
    }
    td.equip span {
        margin-right: 0.5em;
    }
	h2 {
        margin: 1em 0;
	}
</style>
