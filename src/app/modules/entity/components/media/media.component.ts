import { Component, OnInit } from '@angular/core';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  mediaInfo;
  searchInfo;
  filterObj = ['Newest', 'Oldest'];
  pageLoader=false;
  constructor(public entityCommonTabService: EntityCommonTabService) { }

  queryParams: any;

  ngOnInit() {
    // this.mediaInfo = EntityConstants.NewEntityObj.results.overview.images;
    // for (let [key, value] of Object.entries(["overview", "officership"])) {
      //   this.entityApiService.complianceFieldsUrl({
      //     identifier: this.queryParams.query,
      //     fields: value,
      //     jurisdiction: this.queryParams.cId
      //   })//comment this to bypass

  //     this.entityCommonTabService.companybypassObserver //uncomment to bypass
  //       .subscribe((data: any) => {
  //         if (data) {
  //           if (value == "overview") {
  //             this.mediaInfo = JSON.parse(data.results[0].overview.comapnyInfo['images'].value);
  //           }
  //         }
  //       }, (err: any) => {
  //       })
  //     this.entityCommonTabService.Companylinkbypased(value)//uncomment to bypass
  //   }//forloop ends
  this.pageLoader = true;
  this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
    if(data){
      this.pageLoader = false;
      this.mediaInfo = data.results[0].overview.comapnyInfo['images'];
      // this.mediaInfo = data && data.results && data.results[0] && data.results[0].overview && data.results[0].overview.comapnyInfo && data.results[0].overview.comapnyInfo['images'] ? data.results[0].overview.comapnyInfo['images'] : {};
      if(this.mediaInfo){
        let media;
        media = JSON.parse(this.mediaInfo.value);
        this.mediaInfo = media;
      }
    }
  })
  }

}
