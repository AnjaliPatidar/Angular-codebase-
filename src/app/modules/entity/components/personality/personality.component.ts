import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';

@Component({
  selector: 'app-personality',
  templateUrl: './personality.component.html',
  styleUrls: ['./personality.component.scss']
})
export class PersonalityComponent implements OnInit {

  public overviewUtiltyObject: any = {};
  public recommendations: any = {};

  constructor(private commonService: CommonServicesService) { }

  ngOnInit() {


    this.commonService.screeningObservable.subscribe((value) => {
      if (value) {

        this.overviewUtiltyObject.personSearchResult = value ? value : {};
      }
    });


    this.recommendations = this.overviewUtiltyObject.personSearchResult.recommendations &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.received ?
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.received : '';

  }

}
