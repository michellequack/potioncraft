import { Component, inject } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PotionService } from '../../services/potion.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  imports: [MatSliderModule, MatCheckboxModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private _snackBar = inject(MatSnackBar);

  constructor(public potionService: PotionService) { }

  mixPotions() {
    this.potionService.saveAlchemySettingsToLocalStorage();
    this.potionService.mixPotions();
    this._snackBar.open('Settings Saved', 'Close', {duration: 2000});
  }

  increaseItem(settingName: string, setting: number):void {
    setting++;

    if (settingName === 'alchemySkillLevel' || settingName === 'fortifyAlchemyPercent') {
      if (setting > 100) {
        setting = 100;
      }
    }
    else {
      if (setting > 5) {
        setting = 5;
      }
    }

    if(settingName === 'alchemySkillLevel') {
      this.potionService.alchemySettings.alchemySkillLevel = setting;
    }
    else if (settingName === 'alchemistPerkRank') {
      this.potionService.alchemySettings.alchemistPerkRank = setting;
    }
    else if (settingName === 'fortifyAlchemyPercent') {
      this.potionService.alchemySettings.fortifyAlchemyPercent = setting;
    }
  }

  decreaseItem(settingName: string, setting: number):void {
    if (setting >= 1) {
      setting--;
    }

    if(settingName === 'alchemySkillLevel') {
      this.potionService.alchemySettings.alchemySkillLevel = setting;
    }
    else if (settingName === 'alchemistPerkRank') {
      this.potionService.alchemySettings.alchemistPerkRank = setting;
    }
    else if (settingName === 'fortifyAlchemyPercent') {
      this.potionService.alchemySettings.fortifyAlchemyPercent = setting;
    }
  }

  validateAlchemySkillLevel(event: any, setting: number) {
    if (setting < 1) {
      this.potionService.alchemySettings.alchemySkillLevel = 1;
    }
    else if (setting > 100) {
      this.potionService.alchemySettings.alchemySkillLevel = 100;
    }
  }

  validateAlchemistPerkRank(event: any, setting: number) {
    if (setting < 0) {
      this.potionService.alchemySettings.alchemistPerkRank = 0;
    }
    else if (setting > 5) {
      this.potionService.alchemySettings.alchemistPerkRank = 5;
      setting = 5;
    }
  }

  validateFortifyAlchemyPercent(event: any, setting: number) {
    if (setting < 1) {
      this.potionService.alchemySettings.fortifyAlchemyPercent = 0;
    }
    else if (setting > 100) {
      this.potionService.alchemySettings.fortifyAlchemyPercent = 100;
    }
  }
}
