import { Component, inject } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EffectItem } from '../../entities/effectItem';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-desired-effects',
  imports: [MatCheckboxModule, FormsModule],
  templateUrl: './desired-effects.component.html',
  styleUrl: './desired-effects.component.scss'
})
export class DesiredEffectsComponent {
  constructor(public potionService: PotionService) { }

  private _snackBar = inject(MatSnackBar);

  addAll(): void {
    this.potionService.currentEffects.forEach((effect: EffectItem) => {
      effect.isSelected = true;
    })
  }

  removeAll(): void {
    this.potionService.currentEffects.forEach((effect: EffectItem) => {
      effect.isSelected = false;
    })
  }

  saveEffects(): void {
    this.potionService.saveCurrentEffectsToLocalStorage();
    this._snackBar.open('Effects Saved', 'Close', {duration: 2000});
  }
}
