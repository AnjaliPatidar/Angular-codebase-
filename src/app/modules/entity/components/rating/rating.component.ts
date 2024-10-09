import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EntityFunctionService } from '../../services/entity-functions.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  openRating:Boolean = false;
  rating;
  queryParams;
  myOptions = {
    'placement': 'bottom',
    'show-delay': 200,
    'hide-delay':60,
    'width':300,
    'max-width':300,
    'autoPlacement':false,
}
 @Input() aggregateRating:any;
 @Input() rating_summary:any

 constructor(private router:Router, public entityFunctionService: EntityFunctionService,){

 }

  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams();
  }
  // Mouse events to when hover on rating
  onMouseHover(event){
    if(event.type === 'mouseover'){
      this.openRating= true;
    }
  }
  // Mouse events when hover out from rating
  onMouseOut(event){
    if(event.type === 'mouseout'){
      this.openRating= false;
    }
  }
  // calculating percentage based on reviews
  getPercentage(index){
    let totalValue = Number(this.aggregateRating.reviewCount);
    let value = Number(this.rating_summary[index].ratings);
    let percentage = Math.round(value * 100/totalValue);
    return percentage;
  }

  getReviews(){
    this.router.navigateByUrl('/rating');
  }
}
