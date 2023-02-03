import { layout, letters } from './layout';

const all = Object.keys(layout).filter(key => key !== 'H8');
const inner = Object.keys(layout).filter(key => layout[key].danger === 1).filter(key => key !== 'H8');
const middle = Object.keys(layout).filter(key => layout[key].danger === 2);
const outer = Object.keys(layout).filter(key => layout[key].danger === 3);

export const canTravel = (location, target, border) => {
    const direction = (location, target) => {
        if (location[0] === target[0]) {
            return location.substring(1) - target.substring(1) > 0 ? 2 : 4;
        } else if (target.substring(1) === location.substring(1)) {
            return letters.indexOf(target[0]) - letters.indexOf(location[0]) > 0 ? 1 : 3;
        }
    }
    const distance = Math.abs(letters.indexOf(location[0]) - letters.indexOf(target[0])) + Math.abs(target.substring(1) - location.substring(1)) === 1;
    if (distance) return !border.includes(direction(location, target));
    return distance;
}

export const formatDate = (log) => {
    const date = new Date(log.date);
    const addZero = (number) => {
        return number.toString().length === 2 ? number : '0' + number;
    };
    return `Le ${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} à ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
};

export const getAltar = () => getCoord(outer);

export const getBuildings = () => {  
    const buildings = {};
    buildings[getCoord(inner)] = { type: 'Une épicerie', code: 'b1', searchedBy: [], empty: false };
    buildings[getCoord(middle)] = { type: 'Un entrepot de bricolage', code: 'b2', searchedBy: [], empty: false };
    buildings[getCoord(middle)] = { type: 'Une pharmacie', code: 'b3', searchedBy: [], empty: false };
    buildings[getCoord(outer)] = { type: 'Un magasin de matériel informatique', code: 'b4', searchedBy: [], empty: false };
    buildings[getCoord(outer)] = { type: 'Un commissariat de police', code: 'b5', searchedBy: [], empty: false };
    return buildings;
}

const getCoord = (array) => {
    const coor = array[Math.floor(Math.random() * array.length)];        
    array.splice(array.indexOf(coor), 1);
    return coor;
}

export const getDistance = (location, target) => {
    const getIJ = (coordinate) => {
        const i = letters.indexOf(coordinate[0]);
        const j = coordinate.substring(1) - 1;
        return { i, j };
    }
    const { i: li, j: lj} = getIJ(location);
    const { i: ti, j: tj} = getIJ(target);
    return Math.abs(li - ti) + Math.abs(lj - tj);
}

export const getRandomName = () => {
    const start = ['La caverne', 'La cité', 'La demeure', 'La fôret', 'La montagne', 'La plaine', 'La tanière', 'Le hameaux', 'Le havre', 'Le lac', 'Le refuge', 'Le terrier'];
    const middle = ['des alpagas', 'des loups', 'des cochons', 'des escargots', 'des nains', 'des lapins', 'des orcs', 'des lézards', 'des bandits', 'des chevaliers', 'des voleurs', 'des princes'];
    const end = ['mutants', 'masqués', 'alcooliques', 'malades', 'dépressifs', 'hypocondriaques', 'claustrophobes', 'enragés'];
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
    return `${getRandom(start)} ${getRandom(middle)} ${getRandom(end)}`
}

export const getTeddies = () => {
    const coords = {};
    const teddies = [
        {
            class: 'teddy',
            credit: 'Freepik',
            description: 'Agnès',
            icon: 'agnes',
            id: 'e54b92bf-4bd6-4d62-9c51-01e122ec3419',
            quantity: 1,
            type: 'misc',
            uuid: crypto.randomUUID()
        },
        {
            class: 'teddy',
            credit: 'Freepik',
            description: 'Le Loup',
            icon: 'loup',
            id: 'b42833fb-a8ba-4aee-bd6c-d6d78e07667c',
            quantity: 1,
            type: 'misc',
            uuid: crypto.randomUUID()
        },
        {
            class: 'teddy',
            credit: 'Hery Mery',
            description: 'M. Ouink',
            icon: 'ouink',
            id: '5ff7adb3-80b2-4bcb-8813-5e254dc6dc41',
            quantity: 1,
            type: 'misc',
            uuid: crypto.randomUUID()
        }
    ]
    for (let i = 0; i <3; i++) {
        coords[getCoord(all)] = teddies[i];
    }
    return coords;
}

export const getTunnel = () => [getCoord(middle), getCoord(outer)];

export const sortPlayers = (players) => {
    return players = players.sort((a, b) => a.username > b.username ? 1
    : a.username < b.username ? -1 
    : 0);
}
