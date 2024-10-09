import { Directive, OnInit, ElementRef, Renderer2, Input,AfterViewChecked,ChangeDetectorRef,OnChanges, SimpleChanges,AfterContentChecked,DoCheck} from '@angular/core';

@Directive({
  selector: '[appScreeningbadge]'
})
export class ScreeningbadgeDirective implements OnInit,AfterViewChecked,OnChanges,AfterContentChecked,AfterViewChecked,AfterViewChecked,DoCheck{
  @Input() screening: any;
  constructor(public element: ElementRef, public renderer: Renderer2,
	private ref: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    if (this.screening['no-screening']) {
      this.element.nativeElement.classList.add("fa","showTooltip","f-21","mar-y10","f-21","mar-y10","c-pointer","text-dark-cream");
    } else if (!this.screening['no-screening']) {
      var screenedAlert = 'text-dark-green2';
      if (this.element.nativeElement.classList.contains('fa-street-view')) {
        screenedAlert = this.screening.pep_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-ban')) {
        screenedAlert = this.screening['sanction_bst:description'].length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-globe')) {
        screenedAlert = (this.screening.high_risk_jurisdiction.toLowerCase() === 'medium' || this.screening.high_risk_jurisdiction.toLowerCase() === 'high') ? 'text-light-orange' : (this.screening.high_risk_jurisdiction === '' || this.screening.high_risk_jurisdiction.toLowerCase() === 'low' ? screenedAlert : screenedAlert);
      }
      else if (this.element.nativeElement.classList.contains('fa-gavel')) {
        screenedAlert = this.screening.finance_Crime_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-newspaper-o')) {
        screenedAlert = this.screening.adverseNews_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      this.element.nativeElement.classList.add(screenedAlert);
    }
  }
 
  ngAfterViewChecked(){
    

    // if (this.screening['no-screening']) {
    //   this.element.nativeElement.classList.add('text-dark-cream')
    // } else if (!this.screening['no-screening']) {
    //   var screenedAlert = 'text-dark-green2';
    //   var removeclass = this.removeOtherclass(this.element.nativeElement.classList);
    //   if (this.element.nativeElement.classList.contains('fa-street-view')) {
    //     screenedAlert = this.screening.pep_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-ban')) {
    //     screenedAlert = this.screening['sanction_bst:description'].length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-globe')) {
    //     screenedAlert = (this.screening.high_risk_jurisdiction.toLowerCase() === 'medium' || this.screening.high_risk_jurisdiction.toLowerCase() === 'high') ? 'text-light-orange' : (this.screening.high_risk_jurisdiction === '' || this.screening.high_risk_jurisdiction.toLowerCase() === 'low' ? screenedAlert : screenedAlert);
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-gavel')) {
    //     screenedAlert = this.screening.finance_Crime_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-newspaper-o')) {
    //     screenedAlert = this.screening.adverseNews_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   this.element.nativeElement.classList.remove(removeclass);
    //   // this.element.nativeElement.classList.add(screenedAlert);
    //  this.renderer.addClass(this.element.nativeElement, screenedAlert);
		// this.ref.markForCheck();
  // }
    }

  
  removeOtherclass(element) {
    if (element.contains('text-dark-cream')) {
      return 'text-dark-cream';
    }else if (element.contains('text-dark-green2')) {
      return 'text-dark-green2';
    }else if (element.contains('text-light-orange')) {
      return 'text-light-orange';
    }
  }
  ngOnChanges(change:SimpleChanges){
    // if (this.screening['no-screening']) {
    //   if (this.element.nativeElement.classList.contains('street')) {
    //     this.element.nativeElement.classList.add("fa-street-view");
    //   }else if (this.element.nativeElement.classList.contains('ban')) {
    //     this.element.nativeElement.classList.add("fa-ban");
    //   }
    //   else if (this.element.nativeElement.classList.contains('globe')) {
    //     this.element.nativeElement.classList.add("fa-globe");
    //   }
    //   else if (this.element.nativeElement.classList.contains('gavel')) {
    //     this.element.nativeElement.classList.add("fa-gavel");
    //   }
    //   else if (this.element.nativeElement.classList.contains('newspaper')) {
    //     this.element.nativeElement.classList.add("fa-");
    //   }
    // } else if (!this.screening['no-screening']) {
    //   var screenedAlert = 'text-dark-green2';
    //   if (this.element.nativeElement.classList.contains('fa-street-view')) {
    //     screenedAlert = this.screening.pep_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-ban')) {
    //     screenedAlert = this.screening['sanction_bst:description'].length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-globe')) {
    //     screenedAlert = (this.screening.high_risk_jurisdiction.toLowerCase() === 'medium' || this.screening.high_risk_jurisdiction.toLowerCase() === 'high') ? 'text-light-orange' : (this.screening.high_risk_jurisdiction === '' || this.screening.high_risk_jurisdiction.toLowerCase() === 'low' ? screenedAlert : screenedAlert);
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-gavel')) {
    //     screenedAlert = this.screening.finance_Crime_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   else if (this.element.nativeElement.classList.contains('fa-newspaper-o')) {
    //     screenedAlert = this.screening.adverseNews_url.length > 0 ? 'text-light-orange' : screenedAlert;
    //   }
    //   this.element.nativeElement.classList.add(screenedAlert);
    // }

  }
  ngAfterContentChecked(){
    
    
  }
  ngDoCheck(){
    this.screeningConditions();

  }
  screeningConditions(){
    if (this.screening['no-screening']) {
      if (this.element.nativeElement.classList.contains('street')) {
        this.element.nativeElement.classList.add("fa-street-view");
      }else if (this.element.nativeElement.classList.contains('ban')) {
        this.element.nativeElement.classList.add("fa-ban");
      }
      else if (this.element.nativeElement.classList.contains('globe')) {
        this.element.nativeElement.classList.add("fa-globe");
      }
      else if (this.element.nativeElement.classList.contains('gavel')) {
        this.element.nativeElement.classList.add("fa-gavel");
      }
      else if (this.element.nativeElement.classList.contains('newspaper')) {
        this.element.nativeElement.classList.add("fa-");
      }
    } else if (!this.screening['no-screening']) {
      var screenedAlert = 'text-dark-green2';
      var removeclass = this.removeOtherclass(this.element.nativeElement.classList);
      this.element.nativeElement.classList.remove(removeclass);
      if (this.element.nativeElement.classList.contains('fa-street-view') || this.element.nativeElement.classList.contains('street')) {
        screenedAlert = this.screening.pep_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-ban') || this.element.nativeElement.classList.contains('ban')) {
        screenedAlert = this.screening['sanction_bst:description'].length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-globe') || this.element.nativeElement.classList.contains('globe')) {
        screenedAlert = (this.screening.high_risk_jurisdiction.toLowerCase() === 'medium' || this.screening.high_risk_jurisdiction.toLowerCase() === 'high') ? 'text-light-orange' : (this.screening.high_risk_jurisdiction === '' || this.screening.high_risk_jurisdiction.toLowerCase() === 'low' ? screenedAlert : screenedAlert);
      }
      else if (this.element.nativeElement.classList.contains('fa-gavel') || this.element.nativeElement.classList.contains('gavel')) {
        screenedAlert = this.screening.finance_Crime_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      else if (this.element.nativeElement.classList.contains('fa-newspaper-o') || this.element.nativeElement.classList.contains('newspaper')) {
        screenedAlert = this.screening.adverseNews_url.length > 0 ? 'text-light-orange' : screenedAlert;
      }
      this.element.nativeElement.classList.add(screenedAlert);
    }

  }
  
  
}
//
