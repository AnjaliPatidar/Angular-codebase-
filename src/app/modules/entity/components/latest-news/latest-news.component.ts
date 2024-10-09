import { Component, OnInit } from '@angular/core';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.css']
})
export class LatestNewsComponent implements OnInit {

  constructor(
    private entityFunctionService: EntityFunctionService,private ref: ChangeDetectorRef
  ) { }
  public data = [];
  public looper = [100,56];

  queryParams: any;
  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams()
    for (let index = 0; index < 507; index++) {
      this.data.push(index)
    }



    let i = 0;
    let Limit = Math.ceil(this.data.length / 10)
    setInterval(()=>{
      if(i < Limit){
        let start = i * 10;
        let end  = start + 9
        if(end  > this.data.length){
          end = this.data.length
        }
        for(let j = start ; j <= end ; j++){
          this.looper.push(j)
        }
        this.ref.markForCheck();
        if(end == this.data.length){

        }
        i++
      }
      else{

      }
    },2000)

  }

  userByName(index,value) {
    return index;
  }


}
