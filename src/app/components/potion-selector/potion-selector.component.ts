import { Component, inject } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import { faSackDollar, faJarWheat, faLeaf, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PotionEffect } from '../../entities/potionEffect';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Potion } from '../../entities/potion';

@Component({
  selector: 'app-potion-selector',
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './potion-selector.component.html',
  styleUrl: './potion-selector.component.scss'
})
export class PotionSelectorComponent {
  constructor(public potionService: PotionService) { }

  private _snackBar = inject(MatSnackBar);

  public faSackDollar: IconDefinition = faSackDollar;
  public faJarWheat: IconDefinition = faJarWheat;
  public faLeaf: IconDefinition = faLeaf;

  getEffectDescription(potionEffect: PotionEffect): string {
    const result = potionEffect.description.replace('<mag>', potionEffect.magnitude.toString())
      .replace('<dur>', potionEffect.duration.toString());

    return result;
  }

  craftAPotion(potion: Potion) {
    const numCrafted = potion.numCrafted;
    const numLeft = potion.numAvailable - numCrafted;
    const returnMessage = this.potionService.subtractIngredients(potion);

    if (returnMessage !== '') {
      this._snackBar.open(returnMessage, undefined, {duration: 2000});
    }
    else {
      this._snackBar.open(`Crafted ${numCrafted} '${potion.name}'. ${numLeft} left.`, undefined, {duration: 2000});
    }
  }
}
