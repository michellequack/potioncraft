import { PotionEffect } from "./potionEffect";
import { PotionType } from "./enums";

export class Potion {
    id: string = "";
    name: string = "";
    cost: number = 0;
    isViable: boolean = false;
    ingredients?: string[];
    effects?: string[];
    rareCurios: boolean = false;
    dawnguard: boolean = false;
    fishing: boolean = false;
    dragonborn: boolean = false;
    quest: boolean = false;
    saints: boolean = false;
    potionEffects: PotionEffect[] = [];
    potionType: PotionType = PotionType.Potion;
    numAvailable: number = 0;
    numCrafted: number = 1;
}