import { Component, OnInit } from '@angular/core';
import { COMMON_CONST } from '../../constants/common-constants';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';

@Component({
  selector: 'app-rating-indetail',
  templateUrl: './rating-indetail.component.html',
  styleUrls: ['./rating-indetail.component.scss']
})
export class RatingIndetailComponent implements OnInit {
  ratingInfo;
  searchInfo;
  ceriSearchResultObject;
  pageLoader = false;
  filterObj = ['Newest', 'Oldest'];
  constructor(public entityCommonTabService: EntityCommonTabService, ) { }

  ngOnInit() {
    // this.ratingInfo = EntityConstants.NewEntityObj.results.overview.review;


    // for (let [key, value] of Object.entries(["overview", "officership"])) {
    //   this.entityApiService.complianceFieldsUrl({
    //     identifier: this.queryParams.query,
    //     fields: value,
    //     jurisdiction: this.queryParams.cId
    //   })//comment this to bypass

    //   this.entityCommonTabService.companybypassObserver //uncomment to bypass
    //     .subscribe((data: any) => {
    //       if (data) {
    //         if (value == "overview") {
    //           this.ratingInfo =  JSON.parse(data.results[0].overview.comapnyInfo['review'].value);
    //           this.ceriSearchResultObject = data.results[0].overview.comapnyInfo;
    //         }
    //       }
    //     }, (err: any) => {
    //     })
    //   this.entityCommonTabService.Companylinkbypased(value)//uncomment to bypass
    // }//forloop ends
    this.pageLoader = true;
    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (data != null) {
        this.pageLoader = false;
        this.ratingInfo = data.results[0].overview.comapnyInfo['review'];
        if(this.ratingInfo){
          let rating;
          rating = JSON.parse(this.ratingInfo.value);
          this.ratingInfo = rating;
        }
      }
    })
  }
  // change the format of time
  formateTime(d) {
    if (d) {
      let pDate = new Date(d);
      return COMMON_CONST.Months[pDate.getMonth()] + ' ,' + pDate.getDate() + ' ,' + pDate.getFullYear();

    }
  }

  // format the author name to place it in the image
  formatName(name) {
    if (name) {
      let data = name.split(" ");
      if (data.length >= 0) {
        let firstName = data[0].charAt(0).toUpperCase()
        let lastName = data[data.length - 1].charAt(0).toUpperCase()
        if (data.length == 1) {
          return firstName;
        } else {
          return firstName + lastName;
        }
      }
    }
  }
}
