import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  public overviewUtiltyObject: any = {};
  public skills: any = {};

  public skillCollection: Array<PersonSkill> = [];
  constructor(private commonService: CommonServicesService) {
    this.commonService.screeningObservable.subscribe((value) => {
      this.overviewUtiltyObject.personSearchResult = value ? value : {};
    });
    this.skillCollection = this.overviewUtiltyObject.personSearchResult.skills &&
      this.overviewUtiltyObject.personSearchResult.skills.primiarySources &&
      this.overviewUtiltyObject.personSearchResult.skills.primiarySources.length > 0 &&
      this.overviewUtiltyObject.personSearchResult.skills.primiarySources[0].value;

    if(!this.skillCollection){
      return;
    }

    let maxEndorsedBy = Math.max.apply(Math, this.skillCollection.map(function(o) { return o.endorsedBy; }))
    // remove duplicates
    const filterArray = this.skillCollection.reduce((accumalator, current) => {
      if (!accumalator.some(item => item.avgRating === current.avgRating && item.skill === current.skill && item.endorsedBy === current.endorsedBy)) {
        let avgRating = (current.endorsedBy/maxEndorsedBy)*100;
        current.avgRating = Math.round(avgRating * 10) / 10;
        accumalator.push(current);
      }
      return accumalator;
    }, []);
    this.skillCollection = filterArray;
    // sort records by average rating in decending order
    this.skillCollection.sort((a, b) => b.avgRating - a.avgRating);
  }

  ngOnInit() {
  }

  public trackBySkill(_, item: PersonSkill): string {
    return item.skill;
  }
}
export interface PersonSkill {
  skill: string;
  avgRating: number;
  endorsedBy: number;
}
