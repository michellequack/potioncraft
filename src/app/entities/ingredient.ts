import { IngredientEffect } from "./ingredientEffect";
import { Dlc } from "./enums";

export class Ingredient
{
    name: string = '';
    value: number = 0;
    weight: number = .25;
    dlc?: Dlc = Dlc.Vanilla;
    effects: string[] = [];
    effectInfo: IngredientEffect[] = [];
}
