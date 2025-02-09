import { Component, inject } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PotionService } from '../../services/potion.service';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  imports: [MatSliderModule, MatCheckboxModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private _snackBar = inject(MatSnackBar);

  constructor(public potionService: PotionService) {
  
   }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  mixPotions() {
    this.potionService.isLoading = true;
    this.potionService.setAlchemySettings();
    this.potionService.mixPotions();
    this.potionService.isLoading = false;
    this.openSnackBar('Potions mixed.', 'Close');
  }
}
