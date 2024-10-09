import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '../../../services/common-services.service';

@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.scss']
})
export class StickyNotesComponent implements OnInit {

  constructor(private _commonServices : CommonServicesService) { }

  ngOnInit() {
  }

  closeSticky(){
    this._commonServices.toggleSticky();
  }

}
