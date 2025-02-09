import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Potion } from '../entities/potion';
import { Ingredient } from '../entities/ingredient';
import { Effect } from '../entities/effect';
import { EffectType, PotionType } from '../entities/enums';

import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { AlchemySettings } from '../entities/alchemySettings';
import { PotionEffect } from '../entities/potionEffect';
import { IngredientEffect } from '../entities/ingredientEffect';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PotionService {

  private potionData: Potion[] = [];
  private effectData: Map<string, Effect> = new Map<string, Effect>();
  private ingredientData: Map<string, Ingredient> = new Map<string, Ingredient>();
  public alchemySettings = new AlchemySettings();

  public isLoading = true;

  public localStorage!: Storage;

  constructor(private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  getJsonData(): Observable<[Effect[], Ingredient[], Potion[]]>
  {
    const loadStartTime = Date.now();
    const $effects = this.http.get<Effect[]>('effectData.json');
    const $ingredients = this.http.get<Ingredient[]>('ingredientData.json');
    const $potions = this.http.get<Potion[]>('potionData.json');

    return forkJoin( [$effects, $ingredients, $potions]);
  }

  calculateInitialPotionInfo(effects: Effect[], ingredients: Ingredient[], 
    potions: Potion[]): Observable<string>
  {

    this.getAlchemySettings();
    
    effects.forEach((effect: Effect) => {
      this.effectData.set(effect.name, effect);
    });

    ingredients.forEach((ingredient: Ingredient) => {
      this.ingredientData.set(ingredient.name, ingredient);
    });

    this.potionData = potions;
    return of ("Done");
  }

  mixPotions() {
    let potionCounter = -200000;
    const alchemistPerk = this.getAlchemistPerk();

    this.potionData.forEach((potion: Potion) => {
      potionCounter++;
      let potionEffects: PotionEffect[] = [];

      let potionIngredients: Ingredient[] | undefined = potion.ingredients?.map((ingredientName: string) => {
        const ing = this.ingredientData.get(ingredientName) ?? new Ingredient;
        return ing!;
      });

      potion.effects?.forEach((effectName: string) => {

        let effect = this.effectData.get(effectName);
        let potionEffect = new PotionEffect();

        potionEffect.calculatedPower = this.calculateEffectPower(effect!, alchemistPerk);

        const maxIngredient = this.getMaxIngredient(potionIngredients!, effectName);

        const effectInfo = maxIngredient.effectInfo.filter(e => e.name === effectName)[0];
        const magnitude = this.getEffectMagnitude(effectInfo, effect!, potionEffect.calculatedPower);
        let magnitudeFactor = magnitude > 0 ? magnitude : 1;
        const duration = this.getEffectDuration(effectInfo, effect!, potionEffect.calculatedPower);
        let durationFactor = duration > 0 ? duration / 10 : 1;

        potionEffect.magnitude = magnitude;
        potionEffect.duration = duration;

        const goldCost = Math.floor(
          this.getEffectValue(effectInfo, effect!)
          * Math.pow(magnitudeFactor * durationFactor, 1.1)
        );

        potionEffect.goldCost = goldCost;

        magnitudeFactor = effect!.magnitude > 0 ? effect!.magnitude : 1;
        durationFactor = effect!.duration > 0 ? effect!.duration / 10 : 1;
        const baseCost = Math.floor(
          effect!.baseCost * Math.pow(magnitudeFactor * durationFactor, 1.1)
        );

        potionEffect.baseCost = baseCost;

        potionEffect.name = effectName;
        potionEffect.description = effect!.description;
        potionEffect.potionType = effect!.potionType;

        potionEffects.push(potionEffect);
      });

      potion.potionEffects = potionEffects;

      const maxEffect = potionEffects.reduce((max, item) => {
        return item.baseCost > max.baseCost ? item : max;
      }, potionEffects[0]);

      potion.potionType = maxEffect.potionType;
      
      if (potion.potionType === PotionType.Potion) {
        potion.name = `Potion of ${maxEffect.name}`;
      }
      else {
        potion.name = `Poison of ${maxEffect.name}`;
      }
      
      potion.cost = potionEffects.reduce((a, b) => {
        return a + b.goldCost;
      }, 0);

    });
  }

  getEffectMagnitude(effectInfo: IngredientEffect, effect: Effect, power: number) {
    if (effect.magnitude === 0) {
      return 0;
    }
    if (effect.effectType === EffectType.Magnitude) {
      return Math.round(effectInfo.magnitude! * effect.magnitude);
    }
    else {
      return Math.round(effectInfo.magnitude! * effect.magnitude * power)
    }
  }

  getEffectDuration(effectInfo: IngredientEffect, effect: Effect, power: number) {
    if (effect.duration === 0) {
      return 0;
    }
    if (effect.effectType === EffectType.Duration) {
      return Math.round(effectInfo.duration! * effect.duration);
    }
    else {
      return Math.round(effectInfo.duration! * effect.duration * power)
    }
  }

  getEffectValue(effectInfo: IngredientEffect, effect: Effect) {
    return effectInfo.value! * effect.baseCost;
  }

  getMaxIngredient(ingredients: Ingredient[], effectName: string): Ingredient {
    let participatingIngredients: Ingredient[] = [];

    ingredients.forEach((ingredient: Ingredient) => {
      if (ingredient.effects.includes(effectName)) {
        participatingIngredients.push(ingredient);
      }
    });

    const maxIngredient = participatingIngredients.reduce((max, item) => {
      return item.value > max.value ? item : max;
    }, participatingIngredients[0]);

    return maxIngredient;
  }

  calculateEffectPower(effect: Effect, alchemistPerk: number) {
    const ingredientMultiplier = 4;
    const skillFactor = 1.5;
    const physicianPerk = this.getPhysicianPerk(effect.name);
    const benefactorPerk = this.getBenefactorPerk(effect);
    const poisonerPerk = this.getPoisonerPerk(effect);
    const alchemySkill = this.alchemySettings.alchemySkillLevel;
    const fortifyAlchemy = this.alchemySettings.fortifyAlchemyPercent;

    const power = ingredientMultiplier * (1 + (skillFactor - 1) * alchemySkill / 100) *
      (1 + fortifyAlchemy / 100) * (1 + alchemistPerk /100) *
      (1 + physicianPerk / 100) * (1 + benefactorPerk / 100 + poisonerPerk / 100);

    return power;
  }

  getAlchemistPerk() {
    if (this.alchemySettings.alchemistPerkRank === 5) {
      return 80;
    }
    else if (this.alchemySettings.alchemistPerkRank === 4) {
      return 60;
    }
    else if (this.alchemySettings.alchemistPerkRank === 3) {
      return 40;
    }
    else if (this.alchemySettings.alchemistPerkRank === 2) {
      return 20;
    }
    else
      return 0;
  }

  getPhysicianPerk(effectName: string) {
    if (this.alchemySettings.hasPhysicianPerk && 
      (effectName === "Restore Health" || effectName === "Restore Magicka" || effectName === "Restore Stamina")) {
        return 25;
    }
    else 
    {
      return 0;
    }
  }

  getBenefactorPerk(effect: Effect) {
    if (this.alchemySettings.hasBenefactorPerk && effect.potionType === PotionType.Potion) {
      return 25;
    } 
    else {
      return 0;
    }
  }

  getPoisonerPerk(effect: Effect) {
    if (this.alchemySettings.hasPoisonerPerk && effect.potionType === PotionType.Poison) {
      return 25;
    }
    else {
      return 0;
    }
  }

  getAllCombos(arr: any[], k: number, prefix:any[]=[]):any[] {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
      this.getAllCombos(arr.slice(i+1), k-1, [...prefix, v])
    );
  }

  getAlchemySettings(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.alchemySettings.alchemySkillLevel = this.getNumberFromLocalStorage("alchemySkillLevel", 15);
      this.alchemySettings.alchemistPerkRank = this.getNumberFromLocalStorage("alchemistPerkRank", 0);
      this.alchemySettings.fortifyAlchemyPercent = this.getNumberFromLocalStorage("fortifyAlchemyPercent", 0);

      this.alchemySettings.hasPhysicianPerk = this.getBooleanFromLocalStorage("hasPhysicianPerk", false);
      this.alchemySettings.hasBenefactorPerk = this.getBooleanFromLocalStorage("hasBenefactorPerk", false);
      this.alchemySettings.hasPoisonerPerk = this.getBooleanFromLocalStorage("hasPoisonerPerk", false);
      this.alchemySettings.hasPurityPerk = this.getBooleanFromLocalStorage("hasPurityPerk", false);
      this.alchemySettings.hasSeekerOfShadows = this.getBooleanFromLocalStorage("hasSeekerOfShadows", false);
      this.alchemySettings.useVanilla = this.getBooleanFromLocalStorage("useVanilla", true);
      this.alchemySettings.useRareCurios = this.getBooleanFromLocalStorage("useRareCurios", true);
      this.alchemySettings.useDawnguard = this.getBooleanFromLocalStorage("useDawnguard", true);
      this.alchemySettings.useFishing = this.getBooleanFromLocalStorage("useFishing", true);
      this.alchemySettings.useDragonborn = this.getBooleanFromLocalStorage("useDragonborn", true);
      this.alchemySettings.useQuest = this.getBooleanFromLocalStorage("useQuest", true);
      this.alchemySettings.useSaintsAndSeducers = this.getBooleanFromLocalStorage("useSaintsAndSeducers", true);
    }
  }

  setAlchemySettings(): void {
    {
      this.setNumberInLocalStorage("alchemySkillLevel", this.alchemySettings.alchemySkillLevel);
      this.setNumberInLocalStorage("alchemistPerkRank", this.alchemySettings.alchemistPerkRank);
      this.setNumberInLocalStorage("fortifyAlchemyPercent", this.alchemySettings.fortifyAlchemyPercent);

      this.setBooleanInLocalStorage("hasPhysicianPerk", this.alchemySettings.hasPhysicianPerk);
      this.setBooleanInLocalStorage("hasBenefactorPerk", this.alchemySettings.hasBenefactorPerk);
      this.setBooleanInLocalStorage("hasPoisonerPerk", this.alchemySettings.hasPoisonerPerk);
      this.setBooleanInLocalStorage("hasPurityPerk", this.alchemySettings.hasPurityPerk);
      this.setBooleanInLocalStorage("hasSeekerOfShadows", this.alchemySettings.hasSeekerOfShadows);
      this.setBooleanInLocalStorage("useVanilla", this.alchemySettings.useVanilla);
      this.setBooleanInLocalStorage("useRareCurios", this.alchemySettings.useRareCurios);
      this.setBooleanInLocalStorage("useDawnguard", this.alchemySettings.useDawnguard);
      this.setBooleanInLocalStorage("useFishing", this.alchemySettings.useFishing);
      this.setBooleanInLocalStorage("useDragonborn", this.alchemySettings.useDragonborn);
      this.setBooleanInLocalStorage("useQuest", this.alchemySettings.useQuest);
      this.setBooleanInLocalStorage("useSaintsAndSeducers", this.alchemySettings.useSaintsAndSeducers);
    }
  }

  getNumberFromLocalStorage(key: string, defaultValue: number): number {
    const value = localStorage.getItem(key);
    return value === undefined ? defaultValue : Number(value);
  }

  getBooleanFromLocalStorage(key: string, defaultValue: boolean): boolean {
    const value = localStorage.getItem(key);
    var finalValue = false;
    if (value === "true")
    {
      finalValue = true;
    }
    return finalValue
  }

  setNumberInLocalStorage(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  setBooleanInLocalStorage(key: string, value: boolean): void {
    localStorage.setItem(key, value.toString());
  }
}
