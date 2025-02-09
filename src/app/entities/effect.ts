import { PotionType, EffectType } from "./enums";

export class Effect {
    name: string = '';
    description: string = '';
    potionType!: PotionType;
    baseCost: number = 0;
    magnitude: number = 0;
    duration: number = 0;
    valueAt100Skill: number = 0;
    effectType!: EffectType;
}

