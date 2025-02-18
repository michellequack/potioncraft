export class EffectItem {
    name: string = '';
    isSelected: boolean = true;

    constructor(name: string, isSelected: boolean) {
        this.name = name;
        this.isSelected = isSelected;
    }
}