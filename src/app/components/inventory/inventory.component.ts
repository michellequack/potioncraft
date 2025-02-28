import { Component, inject } from '@angular/core';
import { PotionService } from '../../services/potion.service';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../../entities/inventoryItem';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  private _snackBar = inject(MatSnackBar);

  public faPlus: IconDefinition = faPlus;
  public faTrashCan: IconDefinition = faTrashCan;

  constructor(public potionService: PotionService) { }

  addItem(ingredientName: string):void {
    let inventoryItem = 
      this.potionService.currentInventory.find(i => i.ingredientName == ingredientName);

    inventoryItem!.quantity++;
  }

  subtractItem(ingredientName: string):void {
    let inventoryItem = 
      this.potionService.currentInventory.find(i => i.ingredientName == ingredientName);

    if (inventoryItem!.quantity > 0) {
      inventoryItem!.quantity--;
    } 
  }

  addAll(): void {
    this.potionService.currentInventory.forEach((inventoryItem: InventoryItem) => {
      if (inventoryItem.quantity === 0) {
        inventoryItem.quantity = 1;
      }
    })
  }

  removeAll(): void {
    this.potionService.currentInventory.forEach((inventoryItem: InventoryItem) => {
      inventoryItem.quantity = 0;
    })
  }

  save(): void {
    this.potionService.saveCurrentInventoryToLocalStorage();
    this._snackBar.open('Inventory Saved', 'Close', {duration: 2000});
  }
}
