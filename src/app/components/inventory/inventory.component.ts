import { Component } from '@angular/core';
import { PotionService } from '../../services/potion.service';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  constructor(public potionService: PotionService) { }
}
