<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { checkResources, getQuantity } from "$lib/worksites";
	import Item from "../game/Item.svelte";

    export let apLeft = 0;
    export let blocked = false;
    export let completed;
    export let hidden = false;
    export let reload = undefined;
    export let type;
    export let worksite;

    const items = [
        {
            credit: 'Freepik',
            description: 'Terminé',
            icon: 'checked',
            id: '46cf5293-f0cb-4d7d-9ed6-d0ac58ba7d98',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Rechargeable',
            icon: 'reload',
            id: '9b46dad0-1719-4b19-8341-8bcc0bede8b0',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Temporaire',
            icon: 'temporary',
            id: 'd3280ca6-e585-4183-a831-df089eebaa20',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Construire',
            icon: 'build',
            id: '2a8248fb-6e92-45a9-9e98-bcb9a658b5a0',
            type: 'misc'
        },
        {
            credit: 'Eucalyp',
            description: 'En attente de ressources',
            icon: 'materials',
            id: '70fe012b-8ac9-401f-bc1a-96489885f1c8',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Vous devez terminer le chantier précédent',
            icon: 'waiting',
            id: '277ab103-2da6-43d9-87c0-550fe2ddd920',
            type: 'misc'
        },
        {
            credit: 'Freepik',
            description: 'Verrouillé',
            icon: 'locked',
            id: '83d4e547-37f9-4869-826c-97361a94f03d',
            type: 'misc'
        }
    ];

    $: rech = worksite.reload;
    $: ap = rech ? 1 : apLeft;
    $: if(apLeft && !rech) ap = apLeft;
    $: temp = worksite.temporary;

    $: bank = $page.data.encampment?.items ?? [];
</script>

<div class:blocked class:completed class:rech class:temp class:hidden class={type + ' ' + worksite.rarity}>
    {#if type === 'parent'}
        <span class="description">{worksite.description}</span>
    {/if}
    <span class="name">
        {#if rech}
            <span class="reload">!</span>
        {:else if temp}
            <span class="temporary">!</span>
        {/if}
        {!hidden ? worksite.name : 'Chantier inconnu'}
    </span>
    <span class="resources">
        {#if !completed && !hidden}
            {#each worksite.resources as resource}
                {#if rech && ['ammunition', 'food'].includes(resource.item.type)}
                    <span class={blocked? '' : (getQuantity(bank, resource) >= ap * resource.quantity ? 'rechargeable' : 'failed')}>
                        {getQuantity(bank, resource)}/{ap * resource.quantity} <Item item={resource.item} />
                    </span>
                {:else}
                    <span class={blocked? '' : (getQuantity(bank, resource) >= resource.quantity ? 'valid' : 'failed')}>
                        {getQuantity(bank, resource)}/{resource.quantity} <Item item={resource.item} />
                    </span>
                {/if}
            {/each}
        {/if}
    </span>
    <span class="ap">
        {#if !completed && !hidden}
            <input type="range" min="0" max={!rech ? apLeft : 10} disabled={!checkResources(bank, worksite.resources, 1) || blocked} bind:value={ap}>
            <span class={!ap || blocked ? '' : (ap <= $page.data.user.ap ? 'valid' : 'failed')}>
                {ap}
            </span>
        {/if}
    </span>
    <span class={'defense ' + (completed ? (temp ? 'temporary' : rech ? 'reload' : 'completed') : rech ? 'rechargeable' : '')}>{!hidden && !rech ? worksite.defense : (!hidden && rech ? (reload ? reload : ap) * worksite.defense : '??')}</span>
    <span class="icon">
        {#if completed && !temp && !rech}
            <Item item={items[0]} />
        {:else if completed && rech}
            <Item item={items[1]} />
        {:else if completed && temp}
            <Item item={items[2]} />
        {:else if !hidden}
            {#if blocked}
                <Item item={items[5]} />
            {:else if checkResources(bank, worksite.resources, ap)}
                <form method="POST" action="/encampment?/worksite" use:enhance>
                    <input type="text" name="ap" value={ap} hidden>
                    <input type="text" name="id" value={worksite.id} hidden>
                    <button>
                        <Item item={items[3]} border={ap > $page.data.user.ap ? 'red' : ''} />
                    </button>
                </form>
            {:else}
                <Item item={items[4]} />
            {/if}
        {:else}
            <Item item={items[6]} />
        {/if}
    </span>
</div>

<style>
    div {
        height: 35px;
        position: relative;
        display: grid;
        grid-template-columns: 10FR 22FR 4FR 2FR 2FR;
        align-items: center;
        background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
    }
    .description {
        width: 100%;
		position: absolute;
		top: -15px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.12);
		border-radius: 1em 1em 0 0;
		font-size: 0.75em;
		background-color: #ddd;
        text-align: center;
		z-index: 5;
    }

    .name,
    .ap,
    .defense {
        display: flex;
    }
    .name {
        margin-left: 0.5em;
    }
    .failed {
        color: red;
    }
    .rechargeable {
        color: blue;
    }
    .valid {
        color: green;
    }
    .ap {
        justify-content: space-between;
        margin: 0 0.5em;
    }
    .ap input {
        width: 32px;
        cursor: pointer;
    }
    .defense {
        justify-content: center;
    }

    .resources {
        display: grid;
        grid-template-columns: repeat(5, 1FR);
    }
    .resources span {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
    }

    .blocked {
        color: #DDD;
        background-color: #AAA;
    }
    .completed {
        background-color: rgb(255, 255, 205);
    }
    .completed.temp {
        background-color: rgb(255, 230, 205);
    }
    .completed.rech {
        background-color: rgb(220, 220, 255);
    }
    .defense.completed {
        color: green;
        font-weight: bold;
    }
    .hidden {
        background: content-box radial-gradient(rgb(100, 100, 100), rgb(128, 128, 128));
        color: #AAA;
    }
    .parent {
        margin-top: 1.5em;
        border-radius: 0 0 0.25em 0.25em;
    }
    .child {
        margin-top: 2px;
    }
    .reload:first-child,
    .temporary:first-child {
        margin-right: 4px;
    } .reload,
    .temporary {
        color: blue;
        font-weight: bold;
    }
    .temporary {
        color: red;
    }
    .defense.temporary {
        margin-right: 0;
    }
    .blocked .rechargeable,
    .blocked .reload,
    .blocked .temporary {
        color: #DDD;
    }
    .hidden .rechargeable,
    .hidden .reload,
    .hidden .temporary {
        color: #AAA;
    }

    .inhabituel {
		box-shadow: 0 0 3px rgba(0, 128, 0, 0.66), 0 2px 4px rgba(0, 128, 0, 0.66);
	}
	.rare {
		box-shadow: 0 0 3px rgba(0, 0, 255, 0.66), 0 2px 4px rgba(0, 0, 255, 0.66);
	}
	.épique {
		box-shadow: 0 0 3px rgba(128, 0, 128, 0.66), 0 2px 4px rgba(128, 0, 128, 0.66);
	}
	.légendaire {
		box-shadow: 0 0 3px rgba(255, 165, 0, 0.66), 0 2px 4px rgba(255, 165, 0, 0.66);
	}

    form {
		width: 25px;
		height: 25px;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
