import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss']
})
export class DocumentManagementComponent implements OnInit, OnDestroy  {

  constructor(private renderer: Renderer2) {}
 
  ngOnInit() {
    this.renderer.setAttribute(document.body, 'id', 'body-padding-custom');
  }

  ngOnDestroy(): void {
    this.renderer.removeAttribute(document.body, 'id');
  }

}
