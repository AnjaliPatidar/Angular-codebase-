import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';

export interface Watchlist {
  id: string;
  name: string;
  version: string;
  type: string;
  entity_type: string;
  list_type: string;
}

export interface Classification {
  listItemId: string;
  displayName: string;
  code: string;
  listType: string;
  version: string;
  selected: boolean;
}

export interface WatchlistGroup {
  id: string;
  name: string;
  versions: string[];
  selectedVersion: string;
  entity_type: string;
  list_type: string;
}

export const _filter = (groupName: string, opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  if(groupName.toLowerCase().includes(filterValue)) {
    return opt;
  } else {
    return opt.filter(item => item.toLowerCase().includes(filterValue));
  }
};

@Component({
  selector: 'app-chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: ['./chips-autocomplete.component.scss']
})
export class ChipsAutocompleteComponent implements OnInit {
  selectable = true;
  removable = true;
  watchlistCtrl = new FormControl();
  classificationCtrl = new FormControl();
  filteredWatchlists: Observable<any>;
  watchlists: Watchlist[] = [];
  allWatchlists: WatchlistGroup[];
  originalWatchlists = [];
  allItem: Watchlist;
  filteredClassifications: Observable<any>;
  classificationList: Classification[] = [];
  allItemClassification: Classification;
  allClassifications;
  isAllSelected = false;
  isAllShow = true;
  isAllClassificationSelected = false;
  viewOptionPopup = true;
  selectedFeedsForWl=[];

  @Input() dropdownType:string;
  @Input() set feedData(data: any){
    this.selectedFeedsForWl=data;
    this.onload(this.originalWatchlists,"feedselect");
  }
  @Input() set watchlistsData(data: any) {
    this.originalWatchlists = data.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    this.watchlists = [];
    this.onload(this.originalWatchlists,"");
  }
  @Input() component;
  @ViewChild('watchlistInput', { static: false }) watchlistInput: ElementRef<HTMLInputElement>;
  @ViewChild('classificationInput', { static: false }) classificationInput: ElementRef<HTMLInputElement>;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() watchlistChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private translateService: TranslateService, private _alertService: AlertManagementService) {
    this.filteredWatchlists = this.watchlistCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value)),
    );

    this.filteredClassifications = this.classificationCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClassification(value)),
    );
  }

  ngOnInit() {
    this._clearClassificationInput();
    if(this.dropdownType == "classificationtype"){

      this._alertService.getGroupSettingsOnCurrentUser()
      .then((result) => {
              this.allClassifications = result["data"];
              this.onLoadClassification();
      })
      .catch((err) => {
      });
    }



  }

  onLoadClassification(){
    this.allItemClassification = { listItemId: '', displayName: 'All', listType: 'all', selected: true, code: '', version: "("+this.allClassifications.length.toString()+")" };
    this.classificationList.push(this.allItemClassification);
    this.isAllClassificationSelected = true;

    this._clearClassificationInput();
  }

  onload(data,event) {
    this.selectedFeedsForWl;
    if(event=="feedselect"){
      this.watchlists=[];
      let watchlistForFeeds=[];
      if(this.selectedFeedsForWl.length>0){
        data.forEach(element => {
          this.selectedFeedsForWl.forEach(feed=>{
            if(element.supported_classifications.includes(feed)){
              if(!watchlistForFeeds.includes(element)){
                watchlistForFeeds.push(element);
              }
            }
          })
        });
        this.isAllSelected = false;
        this.isAllShow = watchlistForFeeds.length > 0 ? true : false;
        this.allWatchlists = watchlistForFeeds.map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
        this.allItem = { id: '', name: 'All', version: this.allWatchlists.length.toString(), type: 'all', entity_type: '', list_type: '' };
        //this.watchlists.push(this.allItem);
        this._filterGroup(null)
        this._clearInput();
        this.notifyParent();
      }else{
        this.allWatchlists = data.map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
        this.allItem = { id: '', name: 'All', version: this.allWatchlists.length.toString(), type: 'all', entity_type: '', list_type: '' };
        //this.watchlists.push(this.allItem);
        this.isAllSelected = false;
        this.isAllShow = true;
        this._clearInput();
        this.notifyParent();
      }
    }
    else{
      this.allWatchlists = data.map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
      this.allItem = { id: '', name: 'All', version: this.allWatchlists.length.toString(), type: 'all', entity_type: '', list_type: '' };
      //this.watchlists.push(this.allItem);
      this.isAllSelected = false;
      this._clearInput();
      this.notifyParent();
    }

  }

  removeClassification(classification: Classification){
    if(classification.displayName =='All'){
      this.isAllClassificationSelected = false;
      this.allItemClassification.selected = false;
      this.classificationList = [];
    }
    else{
      const index = this.classificationList?this.classificationList.findIndex(el => el.listItemId === classification.listItemId):-1;
      const findIndex = this.allClassifications?this.allClassifications.findIndex(el => el.listItemId === classification.listItemId):-1;
      if(index > -1){
        this.classificationList.splice(index, 1);
      }
      if(findIndex > -1){
        this.allClassifications[findIndex].selected = false;
      }
    }
    this._clearClassificationInput();
    this.notifyParent();
  }

  remove(watchlist: Watchlist): void {
    const index = this.watchlists.indexOf(watchlist);
    if (index >= 0) {
      this.watchlists.splice(index, 1);
    }
    if (watchlist.type === 'all') {
      this.isAllSelected = !this.isAllSelected;
      this.allWatchlists = this.allWatchlists.map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
    } else {
      this.watchlists = this.watchlists.filter((w) => w.id !== watchlist.id);
      let watchlistGroup = this.allWatchlists.find((w) => { return w.id === watchlist.id; });
      watchlistGroup.selectedVersion = '';
    }
    this._clearInput();
    this.notifyParent();
  }

  selectedClassification(event: MatAutocompleteSelectedEvent): void{
    if (event.option.value.listType === 'all') {
      this.isAllClassificationSelected = !this.isAllClassificationSelected;
      this.allItemClassification.selected = this.isAllClassificationSelected;
      this.classificationList = [];
      if (this.isAllClassificationSelected) {
        this.classificationList.push(this.allItemClassification);
        this.allClassifications.forEach(element => {
          element.selected = false
        });
      }
    }
    else {
      if (this.isAllClassificationSelected) {
        this.isAllClassificationSelected = false;
        this.allItemClassification.selected = this.isAllClassificationSelected;
        this.classificationList = [];
      }

      const found = this.allClassifications?this.allClassifications.findIndex(el => el.listItemId === event.option.value.listItemId):-1;
      this.allClassifications[found].selected = !this.allClassifications[found].selected;
      if(this.allClassifications[found].selected){
        this.classificationList.push(this.allClassifications[found]);
      }
      else{
        const findclassi = this.classificationList?this.classificationList.findIndex(el => el.listItemId === event.option.value.listItemId):-1;
        if(findclassi>-1){
          this.classificationList.splice(findclassi, 1);
        }
      }

    }
    this._clearClassificationInput();
    this.notifyParent();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value.type === 'all') {
      this.isAllSelected = !this.isAllSelected;
      this.watchlists = [];
      if (this.isAllSelected) {
        this.watchlists.push(this.allItem);
      }
      //this.allWatchlists = this.originalWatchlists.map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
    } else {
      if (this.isAllSelected) {
        this.isAllSelected = false;
        this.watchlists = [];
        this.allWatchlists = this.allWatchlists
          .map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: group.versions, selectedVersion: '' }));
      }

      let watchlistGroup = this.allWatchlists.find((w) => { return w.id === event.option.value.id; });
      this.watchlists = this.watchlists.filter((w) => w.id !== watchlistGroup.id);
      if (watchlistGroup.selectedVersion === event.option.value.version) {
        watchlistGroup.selectedVersion = '';
      } else {
        this.watchlists.push(event.option.value);
        watchlistGroup.selectedVersion = event.option.value.version;
      }
    }
    this._clearInput();
    this.notifyParent();
  }

  private _filterGroup(value: any): WatchlistGroup[] {
    if (value) {
      if (typeof value === "object") {
        return;
      }
      return this.allWatchlists
        .map(group => ({ id: group.id, name: group.name, entity_type: group.entity_type, list_type: group.list_type, versions: _filter(group.name, group.versions, value), selectedVersion: group.selectedVersion }))
        .filter(group => group.versions.length > 0);
    }
    return this.allWatchlists;
  }


  private _filterClassification(value){
    if(value){
      if (typeof value === "object") {
        return;
      }
      const filterValue = value.toLowerCase();
      return this.allClassifications.filter(option => option.displayName.toLowerCase().includes(filterValue));
    }
    return this.allClassifications;
  }

  private _clearInput() {
    this.watchlistCtrl.setValue(null);
    if(this.watchlistInput) {
      this.watchlistInput.nativeElement.value = '';
      this.watchlistInput.nativeElement.blur();
    }
  }


  private _clearClassificationInput() {
    this.classificationCtrl.setValue(null);
    if(this.classificationInput) {
      this.classificationInput.nativeElement.value = '';
      this.classificationInput.nativeElement.blur();
    }
  }

  returnWatchlistData(selected){
    if ((this.component == "alertDemand") || (this.component == "screeningBatch")) {
      return this.passingValueWithListType(selected)
    } else {
      return this.commonWayOfPassingValue(selected);
    }
  }

  commonWayOfPassingValue(selected){
    if(selected == "All"){
      return this.allWatchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, version: w.versions[0] }));
    }else{
      return this.watchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, version: w.version }));
    }
  }

  passingValueWithListType(selected){
    if(selected == "All"){
      return this.allWatchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, list_type : w.list_type,  version: w.versions[0] }));
    }else{
      return this.watchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, list_type : w.list_type, version: w.version }));
    }
  }

  private notifyParent() {
    if(this.dropdownType == "classificationtype"){
      if(this.isAllClassificationSelected) {
        this.valueChange.emit([]);
      }
      else{
        this.valueChange.emit(this.classificationList);
      }
    }
    else{
      if(this.isAllSelected) {
        this.valueChange.emit(this.allWatchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, version: w.versions[0] })));
      } else {
        this.valueChange.emit(this.watchlists.map(w => ({ id: w.id, name: w.name, entity_type: w.entity_type, version: w.version })));
      }
    }

    if(this.isAllSelected) {
      this.watchlistChange.emit(this.returnWatchlistData("All"));
    } else {
      this.watchlistChange.emit(this.returnWatchlistData("Not-All"));
    }

  }

  public trackById(_, item): string {
    return item.id;
  }

  public trackByListItemId(_, item):string {
    return item.listItemId;
  }
}
