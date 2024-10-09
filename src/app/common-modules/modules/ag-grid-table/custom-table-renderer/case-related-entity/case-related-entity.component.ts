import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-related-entity',
  templateUrl: './case-related-entity.component.html',
  styleUrls: ['./case-related-entity.component.scss']
})


export class CaseRelatedEntityComponent implements OnInit, AfterViewInit {
  @Input() msgName: string;
  
  constructor() { }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }

  agInit(params: any){
    if (params && params.data) {
    }
  }
}
