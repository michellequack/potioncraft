import { PotionType, EffectType } from "./enums";

export class PotionEffect {
    name: string = '';
    description: string = '';
    potionType!: PotionType;
    baseCost: number = 0;
    goldCost: number = 0;
    magnitude: number = 0;
    duration: number = 0;
    effectType!: EffectType;
    calculatedPower: number = 0;
}

