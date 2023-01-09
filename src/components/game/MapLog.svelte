<script>
	// import { fade } from "svelte/transition";
	import { sortItems } from "../../utils/tools";
    import Item from "./Item.svelte";

    export let log;
    
    const formatDate = (log) => {
		const date = new Date(log.date);
		return `Le ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}
</script>

<div>
    {formatDate(log)} :
    {#if log.action === 'in'}
        <div>{log.player} est arrivé dans la zone.</div>
    {:else if log.action === 'out'}
        <div>{log.player} a quitté la zone.</div>
    {:else if log.action === 'kill'}
        <div>{log.player} a tué {log.log.zombies} zombie{log.log.zombies > 1 ? 's' : ''} avec {(log.log.weapon).toLowerCase()}.
        {#if log.log.broken}
            Son arme s'est brisée sous le choc.
        {:else if log.log.ammo}
            Il n'a plus de munitions !
        {/if}
        </div>
    {:else if log.action === 'loot'}
        <div>
            {log.player} a trouvé
            {#each sortItems(log.log.loots) as item}
                <Item {item} />
            {/each}
        </div>
    {:else if log.action === 'pickup'}
        <div>{log.player} a ramassé <Item item={log.log.item} /></div>
    {:else if log.action === 'drop'}
        <div>{log.player} a déposé <Item item={log.log.item} /></div>
    {/if}    
</div>

<style>
</style>
