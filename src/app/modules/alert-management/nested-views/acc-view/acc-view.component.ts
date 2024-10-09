import { Component, OnInit } from '@angular/core';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap'
@Component({
  selector: 'app-acc-view',
  templateUrl: './acc-view.component.html',
  styleUrls: ['./acc-view.component.scss']
})
export class AccViewComponent implements OnInit {
  /**<================= Public variables starts =============================> */
  public caretValue: string = 'left';
  public accodrianData: any = [
    {
      "isDomiciledIn": "de",
      "hasURL": "www.volkswagenag.com",
      "pstal": "38440",
      "country": "Germany",
      "streetAddress": "Berliner Ring 2",
      "city": "Wolfsburg",
      "fullAddress": "Berliner Ring 2 Wolfsburg Germany 38440",
      "first_name": "Volkswagen",
      "last_name": "Aktiengesellschaft",
      "screening_type": "sanction",
      "confidence_level": 88

    },
    {
      "zip": "60323",
      "country": "Germany",
      "streetAddress": "Bockenheimer Landstr. 20",
      "city": "Frankfurt",
      "fullAddress": "Bockenheimer Landstr. 20 Frankfurt Germany 60323",
      "first_name": "Schulte-Hurmann ",
      "last_name": "Axel ",
      "occupation": "Head, Global ",
      "organisation": "Qatar Holding Germany GmbH",
      "gender": "male",
      "screening_type": "pep",
      "confidence_level": 90,
      "isDomiciledIn": "gb"
    }
  ]
  public people: any = [
    {
      "name": "Douglas  Pace"
    },
    {
      "name": "Mcleod  Mueller"
    },
    {
      "name": "Day  Meyers"
    },
    {
      "name": "Aguirre  Ellis"
    },
    {
      "name": "Cook  Tyson"
    }
  ];
  /**<================= Public variables ends =============================> */

  /**<================= private variables starts =============================> */
  /**<================= private variables ends =============================> */
  constructor() { }

  ngOnInit() {
  }

  caretChange($event: NgbPanelChangeEvent,_caret) {
    return this.caretValue = _caret;
  }
}
