import { Component } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  constructor(public potionService: PotionService) { }
}
