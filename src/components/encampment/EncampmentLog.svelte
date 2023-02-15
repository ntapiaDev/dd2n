<script>
	import { formatDate } from '$lib/game';
	import Item from '../game/Item.svelte';
	import PlayerName from '../game/PlayerName.svelte';

	export let log;

	const build = {
		credit: 'Freepik',
		description: 'Construire',
		icon: 'build',
		id: '2a8248fb-6e92-45a9-9e98-bcb9a658b5a0',
		type: 'misc'
	}
	const feed = [
		{
			credit: 'Freepik',
			description: 'Affamé',
			icon: 'hunger',
			id: '781741f2-56d8-4fba-8cb7-a79ea1ab1ca7',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Déshydraté',
			icon: 'dehydrated',
			id: '9031ee03-0eb8-4f07-9bee-7218840ae2bc',
			type: 'misc',
		}
	];
	const meal = {
        credit: 'Freepik',
        description: 'Prendre un bon repas',
        icon: 'meal',
        id: 'fc3cb42f-e68e-461a-9fa3-069f8d6bab17',
        type: 'misc'
    }
	const square = {
		credit: 'Freepik',
		description: 'Laisser un message',
		icon: 'write',
		id: 'e6f9dc67-f4e1-4b66-8192-0b27fccce49e',
		type: 'misc',
	};
	const teddies = [
		{
			class: 'teddy',
			credit: 'Freepik',
			description: 'Agnès',
			icon: 'agnes',
			id: 'e54b92bf-4bd6-4d62-9c51-01e122ec3419',
			type: 'misc'
		}, {
			class: 'teddy',
			credit: 'Freepik',
			description: 'Le Loup',
			icon: 'loup',
			id: 'b42833fb-a8ba-4aee-bd6c-d6d78e07667c',
			type: 'misc'
		},
		{
			class: 'teddy',
			credit: 'Hery Mery',
			description: 'M. Ouink',
			icon: 'ouink',
			id: '5ff7adb3-80b2-4bcb-8813-5e254dc6dc41',
			type: 'misc'
		}
	]
	const transform = {
		credit: 'Freepik',
		description: 'Transformer',
		icon: 'transform',
		id: '5617997b-dfca-4955-a8a7-724729fc8e9e',
		type: 'misc'
	}
	const what = {
		credit: 'Freepik',
		description: 'Réveil difficile',
		icon: 'what',
		id: 'e6b2dc84-9821-4fed-a4a0-24879e38d5a9',
		type: 'misc'
	}
	const wounds = [
		{
			credit: 'Freepik',
			description: 'Indemne',
			icon: 'healthy',
			id: '62372da1-0ac8-4bc0-a0a6-24ebcd928930',
			type: 'misc',
		},
		{
			credit: 'surang',
			description: 'Quelques égratignures',
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Gravement blessé',
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: "À l'agonie",
			icon: 'dying',
			id: '542a9d5d-36c8-42d5-b8c3-6910d7f3db00',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Décédé',
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			type: 'misc',
		}
	];
	const zombie = {
		credit: 'Freepik',
		description: 'Un méchant zombie dévoreur de cerveau',
		icon: 'zombie',
		id: '09bbb34f-667a-48b8-afed-ce876ff4154c',
		type: 'misc'
	}

	const firstLetterToLowerCase = (word) => {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}

	$: gamelog = ['gamestart', 'nextday'].includes(log.action);
</script>

<div class="log" style={`background-color: ${log.color? log.color + '20' : ''}`} class:gamelog>
	<span class="date">{formatDate(log)}</span>
	{#if log.action === 'newGame'}
		<PlayerName color={log.color} username={log.player} /> a rejoint la partie.
	{:else if log.action === 'inEncampment'}
		<PlayerName color={log.color} username={log.player} /> est entré{log.gender === 'female' ? 'e' : ''} dans le campement.
	{:else if log.action === 'outEncampment'}
		<PlayerName color={log.color} username={log.player} /> est sorti{log.gender === 'female' ? 'e' : ''} du campement.
	{:else if log.action === 'heal'}
		<PlayerName color={log.color} username={log.player} /> s'est soigné{log.gender === 'female' ? 'e' : ''} avec {firstLetterToLowerCase(log.log.drug)}.
    {:else if log.action === 'wound'}
        {#if log.log.wound === 0}
            <div class="item">En se réveillant ce matin, <PlayerName color={log.color} username={log.player} /> était de nouveau <Item item={wounds[0]} /></div>
        {:else if log.log.wound === 3}
            <div class="item">En se réveillant ce matin, <PlayerName color={log.color} username={log.player} /> se sentait <Item item={wounds[3]} /></div>
        {:else if log.log.wound === 4}
			<div class="item">Gravement blessé{log.gender === 'female' ? 'e' : ''}, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
        {/if}
	{:else if log.action === 'feed'}
		<PlayerName color={log.color} username={log.player} /> a {log.log.type === 'food' ? 'mangé' : 'bu'} <span class={log.log.type}>{log.log.feed.toLowerCase()}</span> et a regagné {Math.floor(log.log.value)} PA.
	{:else if log.action === 'boost'}
		<PlayerName color={log.color} username={log.player} /> a pris <span class="boost">{log.log.boost.toLowerCase()}</span> et a regagné {log.log.value} PA.
	{:else if log.action === 'tchat'}
		<PlayerName color={log.color} username={log.player} /> : <i><PlayerName color={log.color} username={log.log.message} /></i>
	{:else if log.action === 'dead'}
		{#if log.log.cause === 'both'}
			<div class="item">N'ayant rien mangé et rien bu, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'hunger'}
			<div class="item">Affamé{log.gender === 'female' ? 'e' : ''} après tous ses efforts, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{:else if log.log.cause === 'thirst'}
			<div class="item">N'ayant pu s'hydrater suffisamment, <PlayerName color={log.color} username={log.player} /> est <Item item={wounds[4]} /> ce matin...</div>
		{/if}
	{:else if log.action === 'deposit'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a rangé <Item item={log.log.item} /> dans la banque.</div>
	{:else if log.action === 'withdraw'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a pris <Item item={log.log.item} /> dans la banque.</div>
	{:else if log.action === 'build'}
		{#if log.log.type === 'reloading'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> a dépensé {log.log.ap} PA pour <span class="reload">recharger</span> <Item item={build} substitute="Chantier" /> <b>{log.log.name}<span class="notb">.</span></b></div>
			<div class="mtb">Le chantier est à nouveau fonctionnel, le campement gagne {log.log.defense} DEF !</div>
			<div class="item">
				<span class="build">
					{log.log.items.length === 1 && log.log.items[0].quantity === 1 ?
						'L\'objet suivant a été utilisé' : 'Les objets suivants ont été utilisés'} :
					<span>
						{#each log.log.items as item, i}
							{#if log.log.items.length > 1 && log.log.items.length === i + 1}
								<span>et</span>
							{/if}
							<Item {item} />
						{/each}
					</span>
				</span>
			</div>
		{:else}
			<div class="item"><PlayerName color={log.color} username={log.player} /> a dépensé {log.log.ap} PA dans la construction de <Item item={build} substitute="Chantier" /> <b>{log.log.name}<span class="notb">.</span></b></div>
			{#if log.log.completed}
				<div class="mtb">Le chantier est maintenant terminé, le campement gagne <b>{log.log.defense} DEF</b> !</div>
				<div class="item">
					<span class="build">
						{log.log.items.length === 1 && log.log.items[0].quantity === 1 ?
							'L\'objet suivant a été utilisé' : 'Les objets suivants ont été utilisés'} :
						<span>
							{#each log.log.items as item, i}
								{#if log.log.items.length > 1 && log.log.items.length === i + 1}
									<span>et</span>
								{/if}
								<Item {item} />
							{/each}
						</span>
					</span>
				</div>
				{#if log.log.type === 'reload'}
					<div class="mt">C'est un chantier <span class="reload">rechargeable</span>, il devra être rechargé après l'attaque !</div>
				{:else if log.log.type === 'temporary'}
					<div class="mt">C'est un chantier <span class="alert">temporaire</span>, il ne résistera pas à l'attaque !</div>
				{/if}
			{/if}
			{#if log.log.wounded === 1}
				<div class="item"><PlayerName color={log.color} username={log.player} /> s'est fait mal lors de la construction du chantier et a maintenant <Item item={wounds[1]} /></div>
			{:else if log.log.wounded === 2}
				<div class="item"><PlayerName color={log.color} username={log.player} /> a eu un accident lors de la construction du chantier et est maintenant <Item item={wounds[2]} /></div>
			{/if}
		{/if}
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /> et <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{/if}
	{:else if log.action === 'tavern'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a dépensé {log.log.ap} PA dans la construction de <Item item={meal} substitute='Taverne "Le Never Dry"' /> <b>{log.log.name}<span class="notb">.</span></b></div>
		{#if log.log.completed}
			<div class="mtb">Le chantier est maintenant terminé, la taverne atteint le <b>niveau {log.log.level}</b> !</div>
			<div class="item">
				<span class="build">
					{log.log.items.length === 1 && log.log.items[0].quantity === 1 ?
						'L\'objet suivant a été utilisé' : 'Les objets suivants ont été utilisés'} :
					<span>
						{#each log.log.items as item, i}
							{#if log.log.items.length > 1 && log.log.items.length === i + 1}
								<span>et</span>
							{/if}
							<Item {item} />
						{/each}
					</span>
				</span>
			</div>
		{/if}
		{#if log.log.wounded === 1}
			<div class="item"><PlayerName color={log.color} username={log.player} /> s'est fait mal lors de la construction du chantier et a maintenant <Item item={wounds[1]} /></div>
		{:else if log.log.wounded === 2}
			<div class="item"><PlayerName color={log.color} username={log.player} /> a eu un accident lors de la construction du chantier et est maintenant <Item item={wounds[2]} /></div>
		{/if}
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /> et <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{/if}
	{:else if log.action === 'workshop'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a fabriqué <Item item={log.log.item} /> en <Item item={transform} substitute="Atelier" /> <b>recyclant</b> <span class="workshop">
			{#each log.log.items as item, i}
				{#if log.log.items.length > 1 && log.log.items.length === i + 1}
					<span>et</span>
				{/if}
				<Item {item} />
			{/each}
		</span></div>
		{#if log.log.warning === 'hunger'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /></div>
		{:else if log.log.warning === 'thirst'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{:else if log.log.warning === 'both'}
			<div class="item"><PlayerName color={log.color} username={log.player} /> est <Item item={feed[0]} substitute={'Affamé'} /> et <Item item={feed[1]} substitute={'Déshydraté'} /></div>
		{/if}
	{:else if log.action === 'blueprint'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a découvert
			{#if log.log.type === 'recipe'}
				la recette <Item item={transform} substitute="Atelier" />
			{:else if log.log.type === 'worksite'}
				le chantier <Item item={build} substitute="Chantier" />
			{/if}
			<b>{log.log.name}<span class="notb">.</span></b></div>
	{:else if log.action === 'unlocked'}
		{#if log.log.origin === 'altar'}
			<div class="altar">Après avoir poursuivi une longue et dangereuse quête le menant jusqu'à un mystérieux autel sacrificiel, <PlayerName color={log.color} username={log.player} /> a découvert les plans de <span class="t4"><Item item={meal} substitute='Taverne "Le Never Dry"' /></span> <b>Taverne "Le Never Dry"<span class="notb">.</span></b></div>
			<div class="item tavern">Une fois la construction terminée, vous pourrez venir y faire la fête avec <span><Item item={teddies[0]} /><Item item={teddies[1]} /><span>et</span><Item item={teddies[2]} /></span></div>
		{:else if log.log.origin === 'workshop'}
			<div class="item">Après avoir apporté et étudié avec attention les plans trouvés près de l'entrepot de bricolage, <PlayerName color={log.color} username={log.player} /> a débloqué <Item item={transform} substitute="Atelier" /> <b>Atelier de recyclage<span class="notb">.</span></b></div>
			<div class="mt">Vous pouvez y transformer vos ressources inutiles en matériaux de meilleure qualité !</div>
		{/if}
	{:else if log.action === 'square'}
		<div class="item"><PlayerName color={log.color} username={log.player} /> a 
			{#if log.log.mode === 'add'}
				laissé une nouvelle
			{:else if log.log.mode === 'edit'}
				modifié une
			{:else if log.log.mode === 'delete'}
				supprimé une
			{/if}
			instruction
			{#if log.log.category === 'motd'}
				<b>journalière</b>
			{:else if log.log.category === 'urgent'}
				<span class="alert">urgente</span>
			{:else if log.log.category === 'worksites'}
				de <b>chantier</b>
			{:else if log.log.category === 'workshop'}
				d'<b class="mlneg">atelier</b>
			{/if}sur
			<Item item={square} substitute="Place du village" /> <b>Place du village</b>
			{#if log.log.category === 'bank'}
				concernant la <b>banque<span class="notb">.</span></b>
			{:else}
				<span class="mlneg">.</span>
			{/if}
		</div>
	{:else if log.action === 'nextday' && log.log.survived}
		<div class="nextday">
			<div>Une horde de <span class="success">{log.log.attack} zombies</span> a attaqué votre campement pendant la nuit.</div>
			<div>Grace à vos defenses de <span class="success">{log.log.defense} DEF</span>, votre campement a résisté à l'attaque.</div>
			<div>Environ <span class={(log.log.defense - log.log.lostDef) >= log.log.next ? 'success' : 'alert'}>{log.log.next} zombies</span> sont attendus la nuit prochaine et <span class="alert">{log.log.zombies} nouveaux zombies</span> ont été repérés aux environs du campement.</div>
			{#if log.log.broken.length}
				<div>Les chantiers suivants ont été <span class="alert">détruits</span> pendant l'assaut :</div>
				<ul>
					{#each log.log.broken as worksite}
						<li><Item item={build} substitute="Chantier" /> {worksite.name} (<b>-{worksite.defense} DEF</b>)</li>
					{/each}
				</ul>
			{/if}
			{#if log.log.toReload.length}
				<div>Les chantiers suivants ont besoin d'être <span class="reload">rechargés</span> :</div>
				<ul>
					{#each log.log.toReload as worksite}
						<li><Item item={build} substitute="Chantier" /> {worksite.name} (<b>-{worksite.defense} DEF</b>)</li>
					{/each}
				</ul>
			{/if}
			<div class="survived">
				{#if log.log.dead.length}
					{#each log.log.dead as player, i}
						{#if i > 0 && log.log.dead.length > 1 && log.log.dead.length > i + 1}
							,
						{:else if log.log.dead.length > 1 && log.log.dead.length === i + 1}
							<span class="ml">et</span>
						{/if}
						<PlayerName color={player.color} username={player.player} />
					{/each}
					<span class="alert">{log.log.dead.length > 1 ? 'n\'ont' : 'n\'a'} pas survécu à la nuit.</span>
				{:else}
					<span class="success">Tout le monde a survécu à la nuit.</span>
				{/if}
			</div>
			{#if log.log.regenerated}
				<div>De nouvelles ressources ont été repérées dans {log.log.regenerated} zone{log.log.regenerated > 1 ? 's' : ''} environnante{log.log.regenerated > 1 ? 's' : ''}...</div>
			{/if}
		</div>
	{:else if log.action === 'nextday' && !log.log.survived}
		<div>Une horde de <span class="alert">{log.log.attack} zombies</span> a attaqué votre campement pendant la nuit.</div>
		<div class="not-flex">Vos défenses de <span class="alert">{log.log.defense} DEF</span> n'ont pas suffit à arrêter cet assault et tout le monde s'est fait dévorer le cerveau par une bande d'affreux zombies affamés... <span class="not-flex-item"><Item item={zombie} /></span></div>
	{:else if log.action === 'gamestart'}
		<div class="item">Vous vous reveillez avec un affreux mal de crâne. <b>Que s'est-il passé hier soir?</b> Vous n'en avez plus aucune idée <Item item={what} /></div>
		<div class="gamestart">
			Le monde autour de vous parait maintenant <b>dévasté</b> et vous trouvez refuge parmi un <b>petit groupe de survivants</b> dans un <b>campement abandonné</b>.<br>
			Il va falloir trouver de meilleurs vêtements, de la nourriture, des ressources, et de quoi vous défendre aussi. <b>Qui sait ce qui rôde dehors une fois la nuit tombée?</b>
		</div>
	{:else if log.action === 'leave'}
		<PlayerName color={log.color} username={log.player} /> a quitté la partie.
	{/if}
</div>

<style>
	.log {
		width: 100%;
		position: relative;
		padding: 0.5em 1em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.5em;
		background-color: #eee;
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
		background-color: #ddd;
		z-index: 5;
	}
	.gamelog {
		border: 3px double #AAA;
	}
	.gamelog .date {
		top: -10px;
	}
	.item {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1px 4px;
	}
	.item .build {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.item .build span,
	.item .workshop,
	.tavern span {
		display: flex;
		align-items: center;
	}
	.item .build span span,
	.item .workshop span,
	.tavern span span {
		margin: 0 4px;
	}
	.altar {
		line-height: 18px;
		margin-bottom: 4px;
	}
	.nextday div,
	.gamestart {
		line-height: 24px;
	}
	.nextday li {
		margin-top: 1px;
		display: flex;
		align-items: center;
		gap: 4px;
		list-style: none;
	}
	.nextday b {
		margin: 0 -4px;
	}
	.survived .alert {
		margin-left: 1px;
	}
	.mtb {
		margin: 2px 0 1px;
	}
	.mt {
		margin-top: 1px;
	}
	.ml {
		margin-left: 4px;
	}
	.t4 {
		position: relative;
		top: 4px;
	}
	.alert,
	.reload,
	.success {
		color: red;
		font-weight: bold;
	}
	.food,
	.success {
		color: green;
	}
	.drink,
	.reload {
		color: blue;
	}
	.boost {
		color: orange;
	}
	.notb {
		font-weight: normal;
	}
	.mlneg {
		margin-left: -4px;
	}
	.not-flex {
		margin-top: 8px;
		padding-bottom: 4px;
		line-height: 12px;
	}
	.not-flex-item {
		position: relative;
		top: 4px;
	}
</style>
