import { Directive, ElementRef, Input, HostListener, OnInit, Renderer2 } from '@angular/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Directive({
  selector: '[permission]'
})
export class PermissionDirective implements OnInit {

  private permissions = (GlobalConstants.systemSettings['permissions']) ? GlobalConstants.systemSettings['permissions'] : [];
  domainPermissions: Object;
  selectedDomain: string = (GlobalConstants.currentDomianDetails && GlobalConstants.currentDomianDetails.domainName && GlobalConstants.currentDomianDetails.hasOwnProperty('domainName')) ? GlobalConstants.currentDomianDetails['domainName'] : '';
  permissionId: number;
  disabled: boolean;
  disableEventPropagation: boolean = false;
  @Input('level') elementLevel: number;
  @Input('disabled') set isDisable(value) {
    if (value) {
      this.disabled = value;
      this._renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      this.el.nativeElement.classList.add("c-ban");
      this.el.nativeElement.click = null;
      this.el.nativeElement.style.pointerEvents = "none";
    }
    else {
      this.disabled = false;
      this.el.nativeElement.style.pointerEvents = "auto";
    }

  }

  @Input('PemissionHide')  hide  = false;
  @Input('IsHideRemoveBothEnabled')  isHideRemoveBothEnabled = false;
  @Input('ViewOnly')  viewOnly = false;
  @Input('selectedDomainName') set DomainName(name: string) {
    // this.selectedDomain= name;
  }
  @Input('domainPermission') set doaminLevelPermissions(permissionIds: Object) {
    this.domainPermissions = permissionIds;
    if (this.domainPermissions != {} && this.selectedDomain && this.permissions.length && this.domainPermissions) {
      this.permissionId = this.domainPermissions[this.selectedDomain];
      this.elementLevel = this.domainPermissions['level'];
      this.handleLogic();
    }
  }


  public systemSettings = [];
  private _listeners = [];

  constructor(private el: ElementRef, private _renderer: Renderer2) {
  }

  ngOnInit() {

  }

  @HostListener('click', ['$event']) onMouseEnter(firedEvent) {
    if (this.disableEventPropagation) {
      firedEvent.stopPropagation();
    }
  }

  handleLogic() {
    if(this.disabled){
      return ;
    }
    if (this.permissionId) {
      let validLevel = 0;
      let avoidDataList: Array<any> = [null, undefined, 'null', 'undefined', {}];
      for (let prop in this.permissions) {
        if (this.permissions[prop].length > 0) {
          for (let propty in this.permissions[prop]) {
            let role = this.permissions[prop][propty];
            if (+propty == this.permissionId) {
              if (!avoidDataList.includes(role['permissionId']) && !avoidDataList.includes(role['permissionLevel']) && validLevel < role['permissionLevel']) {
                validLevel = role['permissionLevel'];
              }
            }

          }
        }
      }

      if (this.isHideRemoveBothEnabled) {
        this.hide = true;
      }

      if ((validLevel < this.elementLevel) || (this.el.nativeElement.id == "submenu" && validLevel < this.elementLevel)) {
        if(this.hide){
          this.el.nativeElement.remove();
        }
        else{
          if (validLevel == 0) {
            this._renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            this.el.nativeElement.classList.add("c-ban");
            this.el.nativeElement.click = null;
            this.el.nativeElement.style.pointerEvents = "none";
            this.el.nativeElement.style.visibility = this.viewOnly ? 'visible' : 'hidden';;
            this.disableEventPropagation = true;
          } else {
            this._renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            this.el.nativeElement.classList.add("c-ban");
            this.el.nativeElement.click = null;
            this.el.nativeElement.disabled = true;
            this.el.nativeElement.style.pointerEvents = "none";
            this.disableEventPropagation = true;
          }
        }
      } else if (validLevel == 0) {
        if(this.hide){
          this.el.nativeElement.remove();
        }
        else{
          this._renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
          this.el.nativeElement.classList.add("c-ban");
          this.el.nativeElement.click = null;
          this.el.nativeElement.style.pointerEvents = "none";
          this.el.nativeElement.style.visibility = this.viewOnly ? 'visible' : 'hidden';
          this.disableEventPropagation = true;
        }
      }
      else {
        if (validLevel === this.elementLevel &&  this.elementLevel === 1) {
           // disable if only default permisson === 1 and has view permission (1)
           if (this.isHideRemoveBothEnabled || this.viewOnly){
            this._renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            this.el.nativeElement.classList.add('c-ban');
            this.el.nativeElement.click = null;
            this.el.nativeElement.style.pointerEvents = 'none';
            this.disableEventPropagation = true;
          }
        }
      }
    }
  }
}
