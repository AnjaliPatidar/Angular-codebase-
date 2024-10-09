import { Component, OnInit } from '@angular/core';
import { SharedServicesService } from '../../../shared-services/shared-services.service';
import { Router} from '@angular/router';
import { SourceManagementService } from '../source-management.service';
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  constructor(private _sourceManagementService : SourceManagementService , private _sharedSearvice: SharedServicesService,public router: Router) { }

  ngOnInit() {
  }
}
