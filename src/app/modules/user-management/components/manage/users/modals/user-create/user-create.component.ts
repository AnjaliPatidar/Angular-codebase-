import { Component, OnInit, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';

/*constants*/
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
/*constants*/

/*services*/
import { UserService } from '../../../../../services/user.service';
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
import { UserEditModalComponent } from '../../../../../components/manage/users/modals/user-edit-modal/user-edit-modal.component'

import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
/*services*/

import { GetValueByRefKeyPipe } from '../../../../../pipes/get-value-by-ref-key.pipe'
import { AppConstants } from '@app/app.constant';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { TranslateService } from '@ngx-translate/core';
import { updateEHubObjectDataLS } from "@app/shared/common-helpers";
import { GroupsService } from '../../../../../services/groups.service';
import { WINDOW } from '../../../../../../../core/tokens/window';





@Component({
  selector: 'app-upload-image',
  template: `
    <h1 mat-dialog-title class="d-flex align-items-center justify-content-between pb-4 mb-0 title gotham-medium text-dark-black txt-on-surface light-theme-border-bottom">{{ 'Profile Picture Upload' | translate }} <i class="material-icons c-pointer"  (click)="dialogRef.close()">close</i></h1>

             <div mat-dialog-content class="custom-scroll-wrapper">
             <angular-file-drag-drop
                          (select)="onFileSelect($event)"
                          [maxSize]="maxFileSize"
                          [maxFiles]="1"
                          [removeButton]="false"
                          [submitBtnText]="'Upload'"
                          [showSupportedFormats]="true"
                          [acceptedFormats]="imageSupportFormats"
                         >
             </angular-file-drag-drop>

            </div>
            <div mat-dialog-actions>
                  <button (click)="dialogRef.close()" class="light-theme-btn secondary-btn gotham-medium font-medium fw-500">{{ 'Cancel' | translate }}</button>
                  <button (click)="uploadFile()"  cdkFocusInitial class="light-theme-btn primary-btn gotham-medium font-medium fw-500 width-15">{{ 'Upload' | translate }}</button>
            </div>`,
  styleUrls: ['./user-create.component.scss']
})
export class UploadImageComponent implements OnInit, AfterViewInit {
  public imageSupportFormats: Array<string> = [];
  public afuConfig: any = {};
  public maxFileSize: any = 0;


  constructor(
      public dialogRef: MatDialogRef<UploadImageComponent>,
      @Inject(MAT_DIALOG_DATA) public incomingdata: any,
      private translateService: TranslateService
  ) { }

  ngOnInit() {
    let allImageFormats = ["jpg", "jpeg", "png", "tiff", "tif", "bmp", "gif"];
    allImageFormats.forEach((obj) => {
      if (this.incomingdata && this.incomingdata['systemSettings'] && this.incomingdata['systemSettings']['allowedFileTypes'] && this.incomingdata['systemSettings']['allowedFileTypes'].indexOf(obj) != -1) {
        this.imageSupportFormats.push("." + obj);
      }
    });
    if(this.incomingdata && this.incomingdata['systemSettings'] && this.incomingdata['systemSettings']['maxFileSize']){
      this.maxFileSize = this.incomingdata['systemSettings']['maxFileSize'].replace("MB", "");
    }
  }

  ngAfterViewInit() {
    document.getElementsByClassName("file-drop-box")[0].addEventListener("drop", () => {
      this.uploadFile();
    })
    document.getElementsByClassName('file-input-button')[0].addEventListener('change', () => {
      this.uploadFile();
    })
    /** Creating dynamic elements for upload file popup */
    document.getElementsByClassName('file-drop-box-text')[0].innerHTML = this.translateService.instant('Drag and drop image file here');
    let iconElement = document.createElement("i");
    iconElement.className = 'material-icons upload-icon text-dark-black cloud-upload-icon';
    iconElement.innerHTML = 'cloud_upload';
    document.getElementsByClassName('file-drop-box')[0].prepend(iconElement);

    let sizeText = document.getElementsByClassName('supported-file-format')[0];
    var cln: any = sizeText.cloneNode(true);
    cln.className = 'file-format text-dark-black';
    cln.innerHTML = `${this.translateService.instant('Supported file types') }: ${this.imageSupportFormats.join(', ')}`;
    document.getElementsByClassName('file-drop-box')[0].appendChild(cln);


    let spanElement = document.createElement("span");
    spanElement.innerHTML = this.translateService.instant('or');
    spanElement.className = 'divider-text';
    document.getElementsByClassName('file-drop-box')[0].appendChild(spanElement);

    let btn = document.createElement("input");
    btn.type = "button";
    btn.value = this.translateService.instant('Choose file');
    btn.className = 'upload-btn fw-500 gotham-medium font-medium';
    btn.onclick = this.openFilePopup;
    document.getElementsByClassName('file-drop-box')[0].appendChild(btn);


    let pElement = document.createElement("p");
    pElement.innerHTML = `${this.translateService.instant('Max file size allowed is')} ${this.incomingdata['systemSettings']['maxFileSize']} MB `;
    pElement.className = 'max-file-size-allowed position-absolute text-dark-black';
    pElement.style.bottom = '40px';
    document.getElementsByClassName('file-drop-box')[0].appendChild(pElement);

  }

  openFilePopup() {
    let fileBtn: any = document.getElementsByClassName('file-input-button')[0];
    fileBtn.click();

  }
  onFileSelect(event) {
    this.dialogRef.close(event)
  }
  onDropAreaHover(event) {

  }
  uploadFile() {
    let ele: any = document.getElementsByClassName("submit-button")[0];
    ele.click();
  }




}

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  public updateManually : boolean =  false;
  public newRoleObj = {
    display: false,
    value: "",
  };
  public globalDateFormat = GlobalConstants.globalDateFormat;
  public userDetails: any;
  public rolesFromGroups:any = [];
  public roles: Array<any> = [];
  public groups: Array<any> = [];
  public allRoles: Array<any> = [];
  public allGroups: Array<any> = [];
  public intialRoles: Array<any> = [];
  public intialGroups: Array<any> = [];
  public selectedGroups = [];
  public countries: Array<any> = [];
  public countriesCopy;
  public dateOfBirthRanges: any = {
    min : new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
    max : new Date()
  }
  public clearSearchInput: boolean = true;
  public placeholderLabel = 'Search';
  public FileUploadConfig = {
    allowedTypes: [],
    size: '0MB'
  }

  public profileImage: string;
  public rolesSelect: boolean;
  public groupsSelect: boolean;
  public fileObject: any;
  public userCreateSpinner: boolean = false;
  public statusAttributes: Array<any> = [];
  public submitButtonName: string = "Create User";
  public userStatusAllowedCycle = {
    Pending :['Deactivated','Active'],
    Active : ['Deactivated','Blocked','Suspended'],
    Blocked :['Active',"Pending"],
    Suspended :['Active','Blocked'],
    Deactivated :["Pending"]
  }
  public userStatusName :string;
  public previousStatus : string;
  public showUserStatus :boolean = true;
  public statusSelected : any = {};
  public countrySelected :any = {icon:'',name:''};
  enableAuthentication: any;
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public rolesService: RolesService,
    public dialogRef: MatDialogRef<UserCreateComponent>,
    private utilitiesService: UtilitiesService,
    private ref: ChangeDetectorRef,
    private getValueByRefKeyPipe: GetValueByRefKeyPipe,
    private dateAdapter: DateAdapter<Date>,
    private commonService :CommonServicesService,
    private translateService: TranslateService,
    private groupsService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public incomingdata: any,
    @Inject(WINDOW) private readonly window: Window
  ) {
    this.dateAdapter.setLocale(this.globalDateFormat.Abbreviation)
    this.userDetails = {
      firstName: "",
      middleName: "",
      lastName: "",
      screenName: "",
      country: "",
      dob: "",
      jobTitle: "",
      department: "",
      emailAddress: "",
      phoneNumber: "",
      extension: "",
      roles: [],
      groups: [],
      image: "",
      userStatus: "",
      language :""
    }
    if (this.incomingdata) {
      this.ref.markForCheck();
    }
    if(this.incomingdata && this.incomingdata.operation && this.incomingdata.operation == "edit") {
      this.userDetails['status'] = null;
      this.submitButtonName = "Save Changes";
    }
  }
  get_pattern(element){
    return this.commonService.get_pattern(element);
  }
  get_pattern_error(type){
    return this.commonService.get_pattern_error(type);
  }

  ngOnInit() {
    this.getCoustriesList();

    this.enableAuthentication = this.incomingdata['systemSettings']['Enable Authentication'];
    if(this.incomingdata && this.incomingdata.operation && this.incomingdata.operation == "edit") {
      this.updateManually = !(this.incomingdata && this.incomingdata['systemSettings'] && this.incomingdata['systemSettings']['Allow update manually-Users']);
      if(this.incomingdata && this.incomingdata.userId){
        let  userId = this.incomingdata.userId;
        this.userService.getUserById(userId)
          .then((response: any) => {
            if ( response.status && response.status == "success") {
              let user = response.data ? response.data : {};
              if (user && user.userImage) {
                let imageFile = this.utilitiesService.convertBase64ToJpeg(user.userImage)
                var reader = new FileReader();
                reader.onload = (e: any) => {
                  this.profileImage = e.target.result
                };
                reader.readAsDataURL(imageFile);
              }
              // createImageFromBlob(user.userImage);
              this.userDetails.userId = user.userId ? user.userId : null;
              this.userDetails.firstName = user.firstName ? user.firstName : null;
              this.userDetails.middleName = user.middleName ? user.middleName : null ;
              this.userDetails.lastName = user.lastName ? user.lastName : null;
              this.userDetails.screenName = user.screenName ? user.screenName : null;
              this.userDetails.emailAddress = user.emailAddress ? user.emailAddress : null;
              this.userDetails.dob = user.dob ? new Date(user.dob) : null;
              this.userDetails.country = (user.countryId && user.countryId.listItemId ) ? user.countryId.listItemId : null;
              this.userDetails.jobTitle = user.jobTitle ? user.jobTitle : null;
              this.userDetails.extension = user.extension ? user.extension : null;
              this.userDetails.phoneNumber = user.phoneNumber ? user.phoneNumber : null;
              this.userDetails.department = user.department ? user.department : null;
              this.userDetails.language = user.language ? user.language : null;
              this.countrySelected['icon'] = (user.countryId && user.countryId.code ) ? user.countryId.code.toLowerCase() : null;
              this.countrySelected['name'] = (user.countryId && user.countryId.displayName ) ? user.countryId.displayName : null;
              if (user.roles && Array.isArray(user.roles)) {
                user.roles.forEach(ele => {
                  this.userDetails.roles.push(ele.roleId);
                  if(!ele.isRemovable){
                    this.rolesFromGroups.push(ele.roleId);
                  }
                })
              }
             this.getAllRoles();
              if (user.groups && Array.isArray(user.groups)) {
                user.groups.forEach(ele => {
                  this.userDetails.groups.push(ele.id);
                })
              }
              this.intialRoles = JSON.parse(JSON.stringify(this.userDetails.roles));
              this.intialGroups = JSON.parse(JSON.stringify(this.userDetails.groups));

              this.userDetails.userStatus = (user && user.statusId && user.statusId.listItemId) ?  user.statusId.listItemId : null;
              this.userStatusName = (user && user.statusId && user.statusId.displayName) ? user.statusId.displayName : null;
              this.statusSelected =  (user && user.statusId) ? user.statusId : {};
              this.previousStatus = this.userStatusName;
              this.getStatusAttributes();
              this.rolesSelect = true;
              this.groupsSelect = true;
              this.userCreateSpinner = false;
            }
          })
          .catch((error) => {
            this.userCreateSpinner = false;
            throw error;
          })
      }
    }
    else {
      this.rolesSelect = true;
      this.groupsSelect = true;
      this.userCreateSpinner = false;
    }
    this.getRoles();
    this.getGroups();
    this.getAllRoles();
    this.getAllGroups();
  }
  getRoles() {
    this.roles = [];
    if(this.incomingdata &&  this.incomingdata.systemSettings && this.incomingdata.systemSettings['userRoles'] && Array.isArray(this.incomingdata.systemSettings['userRoles']) ){
      this.incomingdata.systemSettings['userRoles'].forEach(element => {
        this.roles.push({
          id: element.roleId,
          value: element.roleName,
          icon : element.icon ? element.icon  : 'person' ,
          color:element.color
        });
      });
    }
  }
  getGroups() {
    this.groups = [];
    if(this.incomingdata && this.incomingdata.systemSettings && this.incomingdata.systemSettings['userGroups'] && Array.isArray(this.incomingdata.systemSettings['userGroups']) ){
      this.incomingdata.systemSettings['userGroups'].forEach(element => {
        this.groups.push({
          id: element.id,
          value: element.name,
          icon : element.icon ? element.icon  : 'person' ,
          color:element.color
        });
      });
    }
  }
  getAllRoles() {
    this.allRoles = [];
    if(this.incomingdata &&  this.incomingdata.systemSettings && this.incomingdata.systemSettings['allRoles'] && Array.isArray(this.incomingdata.systemSettings['allRoles']) ){
      this.incomingdata.systemSettings['allRoles'].forEach(element => {
        this.allRoles.push({
          id: element.roleId,
          value: element.roleName,
          icon : element.icon ? element.icon  : 'person' ,
          color:element.color,
          isDeletable: this.rolesFromGroups && this.rolesFromGroups.includes(element.roleId) ? true : false
        });
      });
    }
  }
  getAllGroups() {
    this.groupsService.getAllGroups$().subscribe((groups: Array<any>) => {
      this.allGroups = groups.map((group) => {
        return {
          id: group.id,
          value: group.name,
          icon : group.icon || 'person',
          color: group.color
        }
      })
    })
  }
  getStatusAttributes() {
    this.userService.getStatusAttributes()
      .then((response: any) => {
        if (response && Array.isArray(response) ) {
          response.forEach((element:any,index)=>{
            if(this.userStatusAllowedCycle && this.userStatusName && this.userStatusAllowedCycle[this.userStatusName] && element && element.displayName && this.userStatusAllowedCycle[this.userStatusName].indexOf(element.displayName) == -1){
              response[index]['disabled'] =  true;
            }else{
              response[index]['disabled'] =  false;
            }
          });
          this.statusAttributes = response;
          this.ref.markForCheck();
        }
      })
      .catch((err) => {
        this.statusAttributes = [];
      })
  }
  createUser(): void {
    if (this.incomingdata && this.incomingdata.operation && this.incomingdata.operation == "add") {
      this.registerUser();
    }
    else {
      this.updateUser();
    }
  }


  getCoustriesList() {
    this.userService.getCountries().then((response: any) => {
      if(response && Array.isArray(response)){
        this.countries = response;
        this.countriesCopy = response;
      }
    }).catch((error) => {
      this.countries = [];
      this.countriesCopy = [];
    });
  }

  countriesFilter(e) {
    if (e) {
      this.countries = this.countries.filter(val => { return (val && val.displayName && typeof val.displayName == 'string') ? val.displayName.toLowerCase().indexOf(e.toLowerCase()) != -1 : false ;});
    }
    else {
      this.countries = this.countriesCopy;
    }
  }

  addNewRole(newRole,event) {
    if (event.keyCode === 13 && (newRole && newRole.valid) ) {
      this.userCreateSpinner = true;
      this.newRoleObj.display = false;
      this.rolesService.addRole({
        "description": "",
        "notes": "",
        "icon":"person",
        "roleName": (this.newRoleObj && this.newRoleObj.value)? this.newRoleObj.value : {},
      }).then((response: any) => {
        this.userCreateSpinner = false;
        if (response && response.status && response.status == "success" && response.responseMessage && response.data) {
          this.utilitiesService.openSnackBar("success", this.translateService.instant('The role has been added successfully'));

          /*pushing role into global value */
          GlobalConstants.systemSettings['allRoles'].push(response["data"]);
          let newRole = {
            id: (response["data"] &&  response["data"]["roleId"])  ? response["data"]["roleId"] : null,
            value: (response["data"] && response["data"]["roleName"]) ? response["data"]["roleName"] : null,
            icon : "person"
          }
          this.allRoles.push(newRole);
          this.userDetails.roles.push(newRole.id)
        }
        else if (response && response.status && response.status == "error" && response.responseMessage) {
          this.utilitiesService.openSnackBar("error", this.translateService.instant('The role adding has failed'));
        }
        this.newRoleObj.value = "";
      })
        .catch(err => {
          this.utilitiesService.openSnackBar("error", this.translateService.instant('The role adding has failed'));
          this.userCreateSpinner = false;
        })
    }
  }


  openUploadImageModel() {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      data: { 'systemSettings':  (this.incomingdata && this.incomingdata.systemSettings ) ? this.incomingdata.systemSettings : []},
      panelClass: ['upload-image-dialog', 'user-popover'],
      backdropClass:'modal-background-blur'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result[0]) {
        this.fileObject = result[0];
        let displayPreview = () => {
          var reader = new FileReader();
          reader.onload = (e: any) => {
            this.profileImage = e.target.result;
            this.editCurrentPhoto();
          };
          reader.readAsDataURL(result[0]);
        }
        displayPreview();
      }
    });
  }
  editCurrentPhoto() {
    let editDialogRef = this.dialog.open(UserEditModalComponent, {
      data: this.profileImage,
      panelClass: ['upload-image-dialog', 'user-popover']
    });

    editDialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result == 'changeImage') {
          this.openUploadImageModel();
        }
        else {
          this.fileObject = result;
          let displayPreview = () => {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.profileImage = e.target.result;
            };
            reader.readAsDataURL(result);
          }

          if (this.userDetails && this.userDetails.userId) {
            this.userCreateSpinner = true;
            this.uploadImage(this.userDetails.userId, true)
              .then((success) => {
                displayPreview();
                this.userCreateSpinner = false;
              })
              .catch((err) => {
                this.utilitiesService.openSnackBar("error", "unexpected error");
                this.userCreateSpinner = false;
              })
          }
          else {
            displayPreview();
          }
        }
      }
    });
  }
  allowRemove(event,obj,value,element){
    if(obj && value && value.id && obj.indexOf(value.id) == -1){
      const dialogRef = this.dialog.open(UserDeleteComponent, {
        panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
        backdropClass:'modal-background-blur',
        data: { message: (value && value.value)? `Delete ${value.value} from user?` : null }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          if(obj && Array.isArray(obj) && value && value.id && obj.indexOf(value.id) == -1){
            obj.push(value.id);
          }
        }
        setTimeout(()=>{
          if(element && element == "role"){
            this.rolesSelect = false;
          }
          else{
            this.groupsSelect = false;
          }
        },0);
        setTimeout(()=>{
          if(element && element == "role"){
            this.rolesSelect = true;
          }
          else{
            this.groupsSelect = true;
          }
        },0);
      });

    }
  }
  removeRole(obj) {
    let roleName = this.getValueByRefKeyPipe.transform(obj, this.allRoles, 'id', 'value');
    const dialogRef = this.dialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
      backdropClass:'modal-background-blur',
      data: { message: `Delete ${roleName} from user?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesSelect = false;
        let roleIndex: number = (this.userDetails && this.userDetails.roles) ? this.userDetails.roles.indexOf(obj)  :  null;
        if (roleIndex.toString()) {
          setTimeout(() => {
            if(roleIndex != -1){
              this.userDetails.roles.splice(roleIndex, 1);
              this.userDetails.roles = this.userDetails.roles;
            }
            this.rolesSelect = true;
          }, 100);
        }
      }
    });
  }
  removeGroup(obj) {
    let groupName = this.getValueByRefKeyPipe.transform(obj, this.allGroups, 'id', 'value');
    const dialogRef = this.dialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
      backdropClass :'modal-background-blur',
      data: { message: `Delete ${groupName} from user?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupsSelect = false;
        let roleIndex: number = this.userDetails.groups.indexOf(obj);
        if (roleIndex != -1) {
          setTimeout(() => {
            this.userDetails.groups.splice(roleIndex, 1);
            this.userDetails.groups = this.userDetails.groups;
            this.groupsSelect = true;
          }, 100);
        }
      }
    });
  }


  registerUser() {
    this.userCreateSpinner = true;
    this.userDetails['rolesToBeAdded'] = this.userDetails.roles;
    this.userDetails['rolesToBeRemoved'] = [];
    this.userDetails['groupsToBeAdded'] = this.userDetails.groups;
    this.userDetails['groupsToBeRemoved'] = [];
    this.userDetails['isModifiable'] = true;
    this.userService.registerUser(this.userDetails)
      .then((UserResponse: any) => {
        this.userCreateSpinner = false;
        if (UserResponse && UserResponse.status && UserResponse.status.toLowerCase() == "success") {
          if(UserResponse && UserResponse.data && UserResponse.data.userId){
            // if(!this.enableAuthentication){//login?loginId=43294&setPass=true
              var href = AppConstants.Ehub_UI_API + 'login.html?loginId='+UserResponse.data.userId+'&setPass=true';
		          	this.window.open(href , '_blank', 'noopener');
            // }
          }
          if (this.fileObject && UserResponse && UserResponse.data && UserResponse.data.userId ) {
            this.uploadImage(UserResponse.data.userId, false)
              .then(() => {
                this.utilitiesService.openSnackBar("success", this.translateService.instant('The user has been created successfully'));
                this.dialogRef.close();
              })
              .catch(() => {
                this.utilitiesService.openSnackBar("error", this.translateService.instant('The user has been created but the profile upload is failed'));
                this.dialogRef.close();
              });
          }
          else {
            this.utilitiesService.openSnackBar("success", this.translateService.instant('The user has been created successfully'));
            this.dialogRef.close();
          }
        } else if (UserResponse.status.toLowerCase() == "error") {
          if (UserResponse.responseMessage.includes('User already exists with username')) {
            this.utilitiesService.openSnackBar("error", this.translateService.instant('The user with this username already exists'));
          } else {
            this.utilitiesService.openSnackBar("error", this.translateService.instant('The user creation has failed'));
          }
        }

      })
      .catch((err) => {
        this.userCreateSpinner = false;
        this.utilitiesService.openSnackBar("error", this.translateService.instant('The user creation has failed'));
        throw err;
      })
  }
  updateUser() {
    this.userCreateSpinner = true;
    function diff(arr1, arr2) {
      if(!Array.isArray(arr2)){
        arr2 = [];
      }
      var filteredArr1 = Array.isArray(arr1) ? arr1.filter(function (ele) {
        return arr2.indexOf(ele) == -1;
      }) : [];
      return filteredArr1;
    }
    this.userDetails.rolesToBeAdded = diff(this.userDetails.roles, this.intialRoles);
    this.userDetails.rolesToBeRemoved = diff(this.intialRoles, this.userDetails.roles);

    this.userDetails.groupsToBeAdded = diff(this.userDetails.groups, this.intialGroups);
    this.userDetails.groupsToBeRemoved = diff(this.intialGroups, this.userDetails.groups);
    this.userDetails = this.userDetails;
    if(this.userDetails && this.userDetails.userId ){
      this.userService.updateUser(this.userDetails.userId, this.userDetails)
        .then((UserResponse: any) => {
          if ( UserResponse && UserResponse.status && UserResponse.status == "success") {
            this.utilitiesService.openSnackBar("success", this.translateService.instant('The user has been updated successfully'));
            this.userCreateSpinner = false;
            this.dialogRef.close(this.submitButtonName);
            updateEHubObjectDataLS(UserResponse.data);
          }
          else {
            this.utilitiesService.openSnackBar("error", this.translateService.instant('The user updating has failed'));
            this.userCreateSpinner = false;
          }
        }).catch((err) => {
          this.utilitiesService.openSnackBar("error", this.translateService.instant('The user updating has failed'));
          this.userCreateSpinner = false;
        });
    }
  }


  uploadImage(userId, showAlerts) {

    let promise = new Promise((resolve, reject) => {
      if(userId && this.fileObject){
        this.userService.uploadImage(userId, this.fileObject)
          .then((UploadResponse: any) => {
            UploadResponse = {
              status: "success",
              responseMessage: "success"
            }
            this.fileObject = null;
            if (showAlerts) {
              this.userCreateSpinner = false;
              if (UploadResponse && UploadResponse.status && UploadResponse.status == "success") {
                this.utilitiesService.openSnackBar("success", this.translateService.instant('The image has been updated successfully'));
              }
              else if (UploadResponse && UploadResponse.status && UploadResponse.status == "error") {
                this.utilitiesService.openSnackBar("error", this.translateService.instant('The image updating has failed'));
              }
            }
            if (UploadResponse &&  UploadResponse.status && UploadResponse.status == "success") {
              resolve("success");
            }
            else {
              reject("error");
            }
          })
          .catch((err) => {
            this.fileObject = null;
            if (showAlerts) {
              this.utilitiesService.openSnackBar("error", this.translateService.instant('The image updating has failed'));
              this.userCreateSpinner = false;
            }
            reject("error");
          });
      }
      else{
        reject("");
      }
    });
    return promise;
  }
  deleteUserImage() {

    const dialogRef = this.dialog.open(UserDeleteComponent, {
      panelClass: ['user-popover', 'custom-scroll-wrapper'],
      data: {width : "350px" ,message:`Remove user profile picture for ${ (this.userDetails && this.userDetails['firstName']) ? this.userDetails['firstName'] : ''  } ${ ( this.userDetails && this.userDetails['middleName'] ) ? this.userDetails['middleName'] : '' } ${ (this.userDetails && this.userDetails['lastName'] ) ? this.userDetails['lastName'] : '' }?`}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userCreateSpinner = true;
        if( this.userDetails && this.userDetails.userId){
          this.userService.deleteUserImage(this.userDetails.userId)
            .then((response: any) => {
              this.userCreateSpinner = false;
              if (response.status == "success") {
                this.utilitiesService.openSnackBar("success", this.translateService.instant('The user has been deleted successfully'));
                this.profileImage = null;
              }
              else {
                this.utilitiesService.openSnackBar("error", this.translateService.instant('The user deleting has failed'));
              }
            })
            .catch((err) => {
              this.userCreateSpinner = false;
              this.utilitiesService.openSnackBar("error", this.translateService.instant('The user deleting has failed'));
            });
          }
      }
    });



  }
  statusAlert(selectedValue,currentStatus){
    if(selectedValue && selectedValue == "Suspended" || selectedValue == "Deactivated"  ){
      let message :string;
      if(selectedValue == "Suspended"){
        message = 'User account will be blocked, are you sure you wish to continue?';
      }
      else{
        message = `${ (this.userDetails && this.userDetails['firstName'] ) ? this.userDetails['firstName'] : '' } ${(this.userDetails && this.userDetails['middleName'] ) ?this.userDetails['middleName'] : '' } ${(this.userDetails && this.userDetails['lastName'])? this.userDetails['lastName'] : ''} will be deleted permanently and can't be recovered`;
      }
      let dialogRef = this.dialog.open(UserDeleteComponent, {
        panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
        backdropClass:'modal-background-blur',
        data: { message: message ?  message : '' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.previousStatus = selectedValue;
          this.resetUserStatus(selectedValue);
          this.statusSelected = currentStatus;
        }
        else{
          let iconAndId = this.getStatusIdByDisplayName(this.previousStatus);
          this.userDetails.userStatus = (iconAndId && iconAndId[0]) ? iconAndId[0] : null;

        }
      });
    }
    else{

      this.previousStatus = selectedValue;
      this.resetUserStatus(selectedValue);
      this.statusSelected = currentStatus;
    }
    //this.previousStatus
  }
  getStatusIdByDisplayName(displayName){
    let id : any;
    let icon:string;
    if(Array.isArray(this.statusAttributes)){
      this.statusAttributes.forEach((element)=>{
        if(element && element.displayName && element.displayName == displayName ){
          id =( element && element.listItemId) ? element.listItemId : null ;
          icon =( element && element.icon) ? element.icon : null;
          return;
        }
      });
    }
    return [id,icon];
  }
  resetUserStatus(selectedValue){
    if(selectedValue){
      let iconAndId = this.getStatusIdByDisplayName(selectedValue);
      this.userStatusName = selectedValue;
      this.statusSelected = (iconAndId && iconAndId[1]) ? iconAndId[1] : null;
      this.showUserStatus = false;
      if(Array.isArray(this.statusAttributes)){
        this.statusAttributes.forEach((element:any,index)=>{
          if(element && element.displayName && this.userStatusAllowedCycle && this.userStatusAllowedCycle[selectedValue] && this.userStatusAllowedCycle[selectedValue].indexOf(element.displayName) == -1){
            this.statusAttributes[index]['disabled'] =  true;
          }else{
            this.statusAttributes[index]['disabled'] =  false;
          }
        });
        this.statusAttributes = this.statusAttributes;
        setTimeout(()=>{
          this.showUserStatus = true;
        },100);
      }
    }
  }
  getRoleColor(id){
    return this.getValueByRefKeyPipe.transform(id, this.allRoles, 'id', 'color')
  }
  getGroupColor(id){
    return this.getValueByRefKeyPipe.transform(id, this.allGroups, 'id', 'color')
  }
  getRoleName(id){
    return this.getValueByRefKeyPipe.transform(id, this.allRoles, 'id', 'value')
  }
  getGroupName(id){
    return this.getValueByRefKeyPipe.transform(id, this.allGroups, 'id', 'value')
  }
  getSelectedRoleNames(){
    let roleNames = [];
    this.userDetails.roles.forEach((role)=>{
      roleNames.push(this.getValueByRefKeyPipe.transform(role,this.allRoles, 'id', 'value'));
    });
    return roleNames.join(", ");
  }
  getSelectedGroupsNames(){
    let groupNames = [];
      this.userDetails.groups.forEach((group)=>{
        groupNames.push(this.getValueByRefKeyPipe.transform(group,this.allGroups, 'id', 'value'));
      });
      return groupNames.join(", ");
  }


  forgotPassword(){
      var href = AppConstants.Ehub_UI_API + 'login.html?loginId='+this.userDetails.userId+'&setPass=true';
      this.window.open(href , '_blank', 'noopener');
  }

  public trackByListItemId(_, item): string {
    return item.listItemId;
  }

  public trackById(_, item): string {
    return item.id;
  }

}
