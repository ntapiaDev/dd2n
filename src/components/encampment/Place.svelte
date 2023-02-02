<script>
	import { fade } from "svelte/transition";
	import MOTD from "./MOTD.svelte";
	import Trello from "./Trello.svelte";

    export let square;
    $: tasks = square.filter(m => !['motd', 'urgent'].includes(m.category));
</script>

<div in:fade|local={{ delay: 150, duration: 300 }} out:fade|local={{ duration: 150 }}>
    <h3>Place du village ({ `${tasks.length === 0 ? 'Aucune' : tasks.length} tache${tasks.length > 1 ? 's' : ''} en attente` }{#if square.some(m => m.category === 'urgent')}
        {` et `}<span class="urgent">{`${square.filter(m => m.category === 'urgent').length} message${square.filter(m => m.category === 'urgent').length > 1 ? 's' : ''} urgent${square.filter(m => m.category === 'urgent').length > 1 ? 's' : ''}`}</span>{/if})
    :</h3>
    <p>Bienvenue sur la Place du village !<br>
    C'est ici que vous pourrez communiquer entre survivants et définir vos plans d'action.</p>
    <MOTD message={square.find(m => m.category === 'motd')} urgent={square.filter(m => m.category === 'urgent')}/>
    <Trello {tasks} />
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
    .urgent {
        color: red;
    }
</style>
