import { Component, inject } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EffectItem } from '../../entities/effectItem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-desired-effects',
  imports: [MatCheckboxModule, FormsModule, FontAwesomeModule],
  templateUrl: './desired-effects.component.html',
  styleUrl: './desired-effects.component.scss'
})
export class DesiredEffectsComponent {
  constructor(public potionService: PotionService) { }

  public faPlus: IconDefinition = faPlus;
  public faTrashCan: IconDefinition = faTrashCan;

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
}
