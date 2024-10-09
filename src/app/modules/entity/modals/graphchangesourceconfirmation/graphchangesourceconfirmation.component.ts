import { Component, OnInit ,Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-graphchangesourceconfirmation',
  templateUrl: './graphchangesourceconfirmation.component.html',
  styleUrls: ['./graphchangesourceconfirmation.component.sass']
})
export class GraphchangesourceconfirmationComponent implements OnInit { 
  @Input() deleteSelectedEntity;
  @Input() purpose;
  @Input() complexOwnershipToggle;
  public confirmexitData :any={};
  constructor(public ngbActiveModal:NgbActiveModal) { 

  }

  ngOnInit() {
    this.followExitDaata();
  }
  followExitDaata(){
    if(this.purpose === 'graphchange'){
      this.confirmexitData = 'response';
    }else if(this.purpose === 'delterConfirmation'){
      this.confirmexitData = this.deleteSelectedEntity ? this.deleteSelectedEntity :{};
      
    }else if(this.purpose === 'complexStruture'){
      this.confirmexitData =  true;
    }else if(this.purpose === 'deleteConfirmation'){
      this.confirmexitData =  'resData';
    }
  }
  

}
