<script>
    import { page } from '$app/stores';
	// import { fade } from "svelte/transition";
	import { sortItems } from "../../utils/tools";
    import Item from "./Item.svelte";

    export let log;
    
    const formatDate = (log) => {
		const date = new Date(log.date);
        const addZero = (number) => {
            return number.toString().length === 2 ? number : '0' + number;
        }
		return `Le ${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} à ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
	}

    const wound = [
		{
			attack: 0,
			credit: 'surang',
			defense: 0,
			description: 'Quelques égratignures',
			disease: 0,
			hunger: 0,
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Gravement blessé',
			disease: 0,
			hunger: 0,
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		}
	];
</script>

<div class="log">
    <span class="date">{formatDate(log)}</span>
    {#if log.action === 'in'}
        <div>{log.player} est arrivé sur la zone.</div>
    {:else if log.action === 'out'}
        <div>{log.player} a quitté la zone.</div>
    {:else if log.action === 'kill'}
        <div>{log.player} a tué <span class="zombies">{log.log.zombies} zombie{log.log.zombies > 1 ? 's' : ''}</span> avec {(log.log.weapon).toLowerCase()}.
        {#if log.log.broken}
            <div>Son arme s'est brisée sous le choc.</div>
        {:else if log.log.ammo}
            <div>Il n'a plus de munitions !</div>
        {/if}
        {#if log.log.woundedW0}
            {#if log.log.woundedW0 === 1}
            <div>A force de se battre à mains nues, {log.player} a maintenant <Item item={wound[0]} /></div>
            {:else if log.log.woundedW0 === 2}
            <div>A force de se battre à mains nues, {log.player} est maintenant <Item item={wound[1]} /></div>
            {/if}
        {:else if log.log.woundedW1}
            {#if log.log.woundedW1 === 1}
            <div>Un zombie s'est approché un peu trop près et {log.player} a maintenant <Item item={wound[0]} /></div>
            {:else if log.log.woundedW1 === 2}
            <div>Après un accrochage avec un zombie, {log.player} est maintenant <Item item={wound[1]} /></div>
            {/if}
        {/if}
        </div>
    {:else if log.action === 'loot'}
        <div class="item">
            {log.player} a trouvé
            {#each sortItems(log.log.loots) as item}
                <span><Item {item} /></span>
            {/each}
        </div>
    {:else if log.action === 'pickup'}
        <div class="item">{log.player} a ramassé <span><Item item={log.log.item} /></span></div>
    {:else if log.action === 'drop'}
        <div class="item">{log.player} a déposé <span><Item item={log.log.item} /></span></div>
    {/if}    
</div>

<style>
    .log {
        width: 100%;
        position: relative;
        padding: 0.5em 1em;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 0.5em;
        background-color: #EEE;
    }
    .log:not(:last-child) {
        margin-bottom: 1em;
    }
    .log:last-child {
        margin-bottom: 0.15em;
    }
    .date {
        padding: 0 1em;
        position: absolute;        
        top: -7px;
        right: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 1em;
        font-size: 0.75em;
        background-color: #DDD;
        z-index: 5;
    }
    .zombies {
        color: red;
    }
    .item {
        display: flex;
        align-items: center;
    }
    .item span:nth-child(1) {
        margin-left: 4px;
    }
</style>
