import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-timelinepopmodal',
  templateUrl: './timelinepopmodal.component.html',
  styleUrls: ['./timelinepopmodal.component.css']
})
export class TimelinepopmodalComponent implements OnInit {
@Input() public data:any;
  constructor() { }

  ngOnInit() {
  }

}
