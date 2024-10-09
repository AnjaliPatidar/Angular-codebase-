import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICoreMultiSelectOption } from '../model/ICoreMultiSelectOption';

@Component({
  selector: 'core-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CoreMultiSelectComponent implements OnInit, OnDestroy {
  @HostBinding('class.core-multi-select') private readonly mainClass: boolean = true;
  public readonly searchControl: FormControl = new FormControl();
  public readonly selectControl: FormControl = new FormControl([]);
  
  @Input('label') 
  public label: string = 'Select an option';

  @Input('allItems')
  public allItems: Array<ICoreMultiSelectOption> = [];

  @Input('selectedItems')
  public selectedItems: Array<ICoreMultiSelectOption> = [];
  
  // TODO: add validation
  @Output('change')
  public readonly change: EventEmitter<Array<ICoreMultiSelectOption>> = new EventEmitter<Array<ICoreMultiSelectOption>>();

  public get isAllChecked(): boolean {
    return this.selectControl.value.length > 0 && this.selectControl.value.length === (this.allItems && this.allItems.length);
  }

  public get isIndeterminate(): boolean {
    return this.selectControl.value.length > 0 && !(this.selectControl.value.length === (this.allItems && this.allItems.length));
  }

  private readonly destroyed$: Subject<undefined> = new Subject<undefined>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('selectedItems')) {
      this.selectControl.setValue(this.selectedItems);
    }
  }

  public ngOnInit(): void {
    this.selectControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(this.change);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public isItemHidden(item: ICoreMultiSelectOption): boolean {
    return !item.displayName.toLowerCase().includes((this.searchControl.value ? this.searchControl.value.toLowerCase() : ''));
  }

  public selectAll(event: MatCheckboxChange): void {
    this.selectControl.setValue(event.checked ? [...this.allItems] : []);
  }

  public compareWithFn(option: ICoreMultiSelectOption, selection: ICoreMultiSelectOption): boolean {
    return option && selection && option.id === selection.id;
  }

  public trackById(index: number, option: ICoreMultiSelectOption): number {
    return option.id;
  }
}

