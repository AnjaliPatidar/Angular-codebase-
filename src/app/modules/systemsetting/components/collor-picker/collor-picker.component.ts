import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorEvent } from 'ngx-color';
import { GeneralSettingsApiService } from '../../services/generalsettings.api.service';

@Component({
  selector: 'app-collor-picker',
  templateUrl: './collor-picker.component.html',
  styleUrls: ['./collor-picker.component.scss']
})
export class CollorPickerComponent implements OnInit {
  @ViewChild('languageMenuTrigger', { static: false }) languageMenuTrigger: MatMenuTrigger;
  @Output('colorSaved') colorSaved: EventEmitter<string> = new EventEmitter<string>();
  @Input('color') defaultColor?: string;
  public state;
  colorList: any = []
  topColors = []
  bottomColors = []
  showColorSelection:boolean;
  isEditMode:boolean;
  activeColorId:number;

  constructor(private genralService: GeneralSettingsApiService) { }

  ngOnInit(): void {
    this.getColors();
    this.state = this.defaultColor;
  }

  onSaveColor(): void {
    this.colorSaved.emit(this.state)
    this.languageMenuTrigger.closeMenu();
    this.toggleEditMode();
  }

  onCancel(): void {
    this.state = this.defaultColor;
    this.colorSaved.emit(this.state)
    this.languageMenuTrigger.closeMenu();
    this.showColorSelection = false;
  }

  onDeleteColor():void{
    this.state = this.defaultColor;
    this.colorSaved.emit(this.state);
    this.isEditMode = false;
    this.showColorSelection = false;
  }

  openMenu(selectedColor): void {
    this.state = selectedColor;
    this.languageMenuTrigger.openMenu();
    this.showColorSelection = false;
  }

  handleColorComplete($event: ColorEvent): void {
    this.state = $event && $event.color && $event.color.hex ? $event.color.hex : '#fff';
  }

  defaultColorsSwiper(color): void {
    this.activeColorId = color.id;
    this.state = color.color;
  }

  getColorCode(): void {
    return this.state
  }

  colorSwipeFromInput(event): void {
    this.state = event;
  }

  private getColors(): void {
    this.genralService.behaviorSubjectForGetColorList.subscribe((res) => {
      this.colorList = res;
    })
  }

  openMultiColor():void{
    this.toggleEditMode();
    this.showColorSelection = true;
  }

  toggleEditMode():void{
    this.isEditMode = !this.isEditMode;
  }

  public trackById(_, item): string {
    return item.id;
  }
}
