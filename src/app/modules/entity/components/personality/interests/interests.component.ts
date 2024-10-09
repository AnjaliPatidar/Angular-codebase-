import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  public interests: Array<UserInterests> = [];
  stopApiCall = false;
  hasData = false;
  message = 'No Interests';
  public overviewUtiltyObject: any = {};
  public recommendations: any = {};

  constructor() { }

  ngOnInit() {
    this.interests = [
      { name: "Fordam University", description: 'journalism' },
      { name: "Curtin cooperman & company", description: 'Business consulting services' },
      { name: "Jesica Brown", description: 'Journalist' },
      { name: "Sunny New Platz", description: 'School of Business administration' },
      { name: "John Smith", description: 'Principal Cloud Architect | Lead Engineer at cyber Co.',imageSrc: 'https://media-exp1.licdn.com/dms/image/C4E03AQFt4XX6xQS1eg/profile-displayphoto-shrink_100_100/0?e=1611792000&v=beta&t=AXWtDolFa5yKMgEo7mPZ1Upr4bYF7RB3t3Y6PpiXyR4' },
      { name: "Mark Twen", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen1", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen2", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen3", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen4", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen", description: 'Principal Cloud Architect cyber Co.' },
      { name: "Mark Twen", description: 'Principal Cloud Architect cyber Co.' },
    ]
    this.hasData = true;
    this.message = "";
  }

  getInterests() {
  }

  public trackByName(_, item): string {
    return item.name;
  }
}

export class UserInterests {
  name?: string;
  description?: string;
  imageSrc?: string;
  recommenderUrl?: string;
}

