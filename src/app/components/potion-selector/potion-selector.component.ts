import { Component } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import { faSackDollar, faJarWheat, faLeaf, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PotionEffect } from '../../entities/potionEffect';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-potion-selector',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './potion-selector.component.html',
  styleUrl: './potion-selector.component.scss'
})
export class PotionSelectorComponent {
  constructor(public potionService: PotionService) { }

  public faSackDollar: IconDefinition = faSackDollar;
  public faJarWheat: IconDefinition = faJarWheat;
  public faLeaf: IconDefinition = faLeaf;

  getEffectDescription(potionEffect: PotionEffect): string {
    const result = potionEffect.description.replace('<mag>', potionEffect.magnitude.toString())
      .replace('<dur>', potionEffect.duration.toString());

    return result;
  }
}
