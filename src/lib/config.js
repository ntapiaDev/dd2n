// Multiplicateurs de loot:
// TYPE : x quantité
export const resource = 10;
export const ammunition = 15;
export const explosive = 5;
export const food_drink = 3;
export const drug_weapon_armour = 2;
export const blueprint = 1;
// RARITY : x quantité
export const commun = 5;
export const inhabituel = 3;
export const rare = 2;
export const épique = 1;

// Plus items : > valeur
export const plus_four = 1;
export const plus_tree = 0.95;
export const plus_two = 0.9;
export const plus_one = 0.75;

// Nombre de loots trouvés
// BUILDING : 4 + 1 max
export const loot_building = Math.ceil(Math.random() * 4) + 1;
// SEARCH : 3 max
export const loot_search = Math.ceil(Math.random() * 3);
// STACKS DE MUNITIONS : 10 max
export const quant_ammo = Math.ceil(Math.random() * 10);
// Autres items : 1 max
export const quant_items = 1;

// Expuisement batiment et case
// BUILDING : > valeur
export const empty_building = 0.9;
// SEARCH : > valeur
export const empty_1 = 0.66;
export const empty_2 = 0.75;
export const empty_3 = 0.9;

// Nextday
// USER : - valeur
export const nextday_hunger = 25;
export const nextday_thirst = 25;
// CELL régénérée : > valeur
export const nextday_empty = 0.9;

// Nombre de zombies
// BUILDING : valeur de départ, + valeur par jour
export const zombies_building = 2;
export const nextday_building = 2;
// CELL : + valeur par jour
export const nextday_cell = 1;

// Risque de blessure
// SANS ARME : > valeur
export const wound_unarmed = 0.75;
// ARME BLANCHE : > valeur
export const wound_armed = 0.99;

// Chance de critique : > valeur
export const critical_chance = 0.9;
