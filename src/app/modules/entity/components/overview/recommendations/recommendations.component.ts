import { Component, OnInit } from "@angular/core";
import { CommonServicesService } from '@app/common-modules/services/common-services.service';

@Component({
  selector: "app-recommendations",
  templateUrl: "./recommendations.component.html",
  styleUrls: ["./recommendations.component.scss"],
})
export class RecommendationsComponent implements OnInit {
  public recData: Array<UserRecommendation> = [];
  stopApiCall = false;
  hasData = false;
  message = 'No recommendations';
  recommendationsCount = 0;
  public overviewUtiltyObject: any = {};
  public recommendations: any = {};
  selectedFilter = 'Received';

  constructor(private commonService: CommonServicesService) {
   // this.getRecommendations();
  }

  ngOnInit() {
    this.commonService.screeningObservable.subscribe((value) => {
      this.overviewUtiltyObject.personSearchResult = value ? value : {};
      this.getRecommendations();
    });
  }

  getRecommendations() {

  if (this.selectedFilter == 'Received') {
    this.recommendations = this.overviewUtiltyObject.personSearchResult.recommendations &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources.length > 0 &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value &&
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.received ?
      this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.received : '';

  } else if (this.selectedFilter == 'Given') {

    this.recommendations = this.overviewUtiltyObject.personSearchResult.recommendations &&
    this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources &&
    this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources.length > 0 &&
    this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value &&
    this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.given ?
    this.overviewUtiltyObject.personSearchResult.recommendations.primiarySources[0].value.given : '';
  }



  if (this.recommendations !== '') {
    // remove duplicates
    const filterArray = this.recommendations.reduce((accumalator, current) => {
      if (!accumalator.some(item => item.imageSrc === current.imageSrc && item.name === current.name && item.note === current.note && item.recommendation === current.recommendation && item.recommenderUrl === current.recommenderUrl)) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);
    this.recommendations = filterArray;
    this.recData = [];

    this.recommendations.forEach((element) => {
      const recomendation = {} as UserRecommendation;

      recomendation.name = element.name;
      recomendation.imageSrc = element.image;
      recomendation.position = element.jobTitle;
      recomendation.recommendation = element.recommendation;
      recomendation.note = element.note;
      recomendation.recommenderUrl = element.url;

      this.recData.push(recomendation);
    });
    this.hasData = true;
    this.message = '';
    this.recommendationsCount = this.recData.length;
  } else {
    this.recommendationsCount = 0;
    this.hasData = false;
  }
}


  filterRecommendations(filter:string) {
    this.selectedFilter = filter;
    this.getRecommendations();
  }
  public trackByName(_, item): string {
    return item.name;
  }
}

export class UserRecommendation {
  name: string;
  position: string;
  note: string;
  recommendation: string;
  imageSrc: string;
  recommenderUrl: string;
}
