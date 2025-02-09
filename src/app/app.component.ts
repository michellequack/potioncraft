import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { PotionService } from './services/potion.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { SettingsComponent } from "./components/settings/settings.component"; 

@Component({
  selector: 'app-root',
  imports: [NgbAccordionModule, FontAwesomeModule, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'potioncraft';
  faFlask = faFlask;

  items = ['Settings', 'Inventory', 'Desired Effects', 'Potions'];
  selectedItem = 'Settings';

  constructor(public potionService: PotionService) { }

  ngOnInit(): void {
    this.potionService.getJsonData()
    .subscribe(([effects, ingredients, potions]) => {
      this.potionService.isLoading = true;
      this.potionService.calculateInitialPotionInfo(effects, ingredients, potions).subscribe((returnStr) => {
      });
      
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.potionService.isLoading = false;
    }), 0;
   
  }
}
