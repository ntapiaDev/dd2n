// Couleurs des joueurs :
export let colors = [
    { name: 'Magenta', code: "#8B008B", taken: false },
    { name: 'Violet', code: "#9400D3", taken: false },
    { name: 'Indigo', code: "#4B0082", taken: false },
    { name: 'Bleu marine', code: "#00008B", taken: false },
    { name: 'Bleu', code: "#0000FF", taken: false },
    { name: 'Bleuet', code: "#4A83EC", taken: false },
    { name: 'Sarcelle', code: "#008080", taken: false },
    { name: 'Vert', code: "#008000", taken: false },
    { name: 'Pomme', code: "#68AD00", taken: false },
    { name: 'Doré', code: "#FFB700", taken: false },
    { name: 'Orange', code: "#FF7F00", taken: false },
    { name: 'Corail', code: "#FF4500", taken: false },
    { name: 'Rouge', code: "#FF0000", taken: false },
    { name: 'Cramoisi', code: "#DC143C", taken: false },
    { name: 'Marron', code: "#800000", taken: false }
];

// Multiplicateurs de loot:
// TYPE : x quantité
export const food = 2;
export const drink = 2;
export const drug = 1;
export const weapon_w1 = 4;
export const weapon_w2 = 2;
export const ammunition = 10;
export const explosive = 5;
export const armour = 1;
export const bag = 1;
export const resource = 10;
export const blueprint = 1;
// RARITY : x quantité
export const commun = 6;
export const inhabituel = 3;
export const rare = 2;
export const épique = 1;

// Plus items : > valeur
export const plus_four = 0.99;
export const plus_tree = 0.95;
export const plus_two = 0.9;
export const plus_one = 0.75;

// Nombre de loots trouvés
// BUILDING : 4 + 1 max
// export const loot_building = () => Math.ceil(Math.random() * 4) + 1;
export const loot_building = () => Math.random() > 0.75 ? 3 : 2;
// SEARCH : 3 max
// export const loot_search = () => Math.ceil(Math.random() * 3);
export const loot_search = () => Math.random() > 0.75 ? 2 : 1;
// STACKS DE MUNITIONS : 10 max
export const quant_ammo = () => Math.ceil(Math.random() * 10);
// AUTRES ITEMS : 1 max
export const quant_items = 1;
// CACHE : > valeur, 1 + (3 + 1 max)
export const resource_cache = 0.9;
// export const quantity_cache = () => Math.ceil(Math.random() * 3) + 1;
export const quantity_cache = () => 2;

// Expuisement batiment et case
// BUILDING : > valeur
export const empty_building = 1;
// SEARCH : > valeur
export const empty_1 = 0.66;
export const empty_2 = 0.75;
export const empty_3 = 0.9;

// Nextday
// const next = Math.round(encampment.attack * (1.25 + (Math.random() * 5) / 10)); (ancienne valeur)
// const next = Math.round(encampment.attack * (1.1 + (Math.random() * 4) / 10));
// ATTACK : J2 = entre 50 et 150
// export const nextday_attack = (day) => (day * 100 - 50) + Math.round(Math.random() * 100);
// export const nextday_attack = (day) => ((day + 1) * 50 - 50) + Math.round(Math.random() * 100);
export const calcul_attack = (day, zombies) => Math.round(zombies / (8 - day / 8));
// CELL régénérée : > valeur
export const nextday_empty = 0.75;
// USER : - valeur
export const nextday_hunger = 24
export const nextday_thirst = 24;

// Nombre de zombies
// GAMESTART :
export const zombies_start = (distance) => Math.floor(Math.random() * (distance * 1.1 - 2));
// BUILDING : valeur de départ, + valeur par jour
export const zombies_building = 2;
export const nextday_building = 2;
// CELL : + valeur par jour
export const nextday_cell = 1;
// NEXTDAY :
// export const nextday_zombies = (zombies, danger, building) => Math.round(zombies * (1 + (danger / 20)) + (building ? nextday_building : nextday_cell));
export const nextday_zombies = (zombies, danger, building) => zombies + danger + (building ? nextday_building : 0);

// Risque de blessure
// SANS ARME : > valeur
export const wound_unarmed = 0.75;
// ARME BLANCHE : > valeur
export const wound_armed = 0.99;

// Chance de critique : > valeur
export const critical_chance = 0.9;
