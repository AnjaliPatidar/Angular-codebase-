import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-adverse-media',
  templateUrl: './alert-adverse-media.component.html',
  styleUrls: ['./alert-adverse-media.component.scss']
})
export class AlertAdverseMediaComponent implements OnInit {
  @Input('alertData') alertView : object;
  constructor() { }
  ngOnInit() {
  }
}
