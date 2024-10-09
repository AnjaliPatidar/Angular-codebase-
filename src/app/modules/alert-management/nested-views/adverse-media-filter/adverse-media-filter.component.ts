import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { groupBy } from 'lodash-es';
import { AdverseMediaFilterUtility } from './adverse-media-filter.utility';

@Component({
  selector: 'app-adverse-media-filter',
  templateUrl: './adverse-media-filter.component.html',
  styleUrls: ['./adverse-media-filter.component.scss']
})

export class AdverseMediaFilterComponent implements OnInit, OnChanges {
  @Input() hitsKeywordData: Array<any>;
  @Output() selectedKeywords = new EventEmitter();
  adverseKeyword: any = []
  // copiedAdverseKeyword: Array<any[]> = []
  selectedMedia: Array<any> = []
  showkeywords: boolean = true
  searchQuery: string = ''

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hitsKeywordData) {
      if (this.hitsKeywordData.length > 0) {
        this.hitsKeywordData.map(val => val.completed = true)
        const hitGroup = groupBy(this.hitsKeywordData, (d: any) => { return d.type });
        this.adverseKeyword = Object.keys(hitGroup).map(value => ({ 'hit_producer_category': value, 'hit_generated': hitGroup[value], completed: true }))
        // this.copiedAdverseKeyword = JSON.parse(JSON.stringify(this.adverseKeyword))
        this.searchQuery = ''
        this.setAccordionData()
      }
    }
  }

  updateAllComplete(hit: any) {
    hit.completed = hit.hit_generated != null && hit.hit_generated.every((t: any) => t.completed);
    this.searchKeywordsEvent()
    this.setAccordionData()
  }

  someComplete(hit: any): boolean {
    // if (hit.hit_generated == null) {
    //   return false;
    // }
    return ( hit.hit_generated.filter((t: any) => t.completed).length > 0 && !hit.completed );
  }

  setAll(hit: any, checked: boolean) {
    hit.completed = checked;
    // if (hit.hit_generated == null) {
    //   return;
    // }
    hit.hit_generated.forEach((t: any) => (t.completed = checked));
    this.searchKeywordsEvent()
    this.setAccordionData()
  }

  setAccordionData() {
    this.selectedMedia = AdverseMediaFilterUtility.filterSelectedAdverseMediaData(this.adverseKeyword)
    this.selectedKeywords.emit(this.selectedMedia)
  }

  searchKeywordsEvent() {
    this.adverseKeyword.forEach(item => item.completed = item.hit_generated.every(check => check.completed) ? true : false)
  }
}
