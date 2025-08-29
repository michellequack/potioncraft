import { PotionType, EffectType } from "./enums";

export class PotionEffect {
    name: string = '';
    description: string = '';
    potionType!: PotionType;
    goldCost: number = 0;
    magnitude: number = 0;
    duration: number = 0;
    effectType!: EffectType;
    calculatedPower: number = 0;
    internalCost: number = 0;
}

