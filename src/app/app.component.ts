import { Component } from '@angular/core';
import { PotionService } from './services/potion.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFlask, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SettingsComponent } from "./components/settings/settings.component";
import { InventoryComponent } from "./components/inventory/inventory.component";
import { DesiredEffectsComponent } from "./components/desired-effects/desired-effects.component";
import { PotionSelectorComponent } from "./components/potion-selector/potion-selector.component"; 

@Component({
  selector: 'app-root',
  imports: [NgbAccordionModule, FontAwesomeModule, SettingsComponent, InventoryComponent, DesiredEffectsComponent, PotionSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  public title: string = 'Potions Master';
  public faFlask: IconDefinition = faFlask;

  public accordionItems: string[] = ['Settings', 'Inventory', 'Desired Effects', 'Potions'];
  
  constructor(public potionService: PotionService) { }

  ngOnInit(): void {
    this.potionService.getJsonData()
    .subscribe(([effects, ingredients, potions]) => {
      this.potionService.isLoading = true;
      this.potionService.calculateInitialPotionInfo(effects, ingredients, potions).subscribe((returnStr) => {
        this.potionService.isLoading = false;
      });
      
    });
  }

}
