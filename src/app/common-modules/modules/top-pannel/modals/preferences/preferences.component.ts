import {Component, OnInit, Inject} from '@angular/core';
import { UserService } from '../../../../../modules/user-management/services/user.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';

interface INewTheme {
  userId: string;
  themeName: string;
  themeId: string;
  selected: boolean;
}
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public dateOfBirthRanges: any = {
    max: new Date(new Date().setFullYear(new Date().getFullYear() - 16))
  }
  public userId?: string;
  public countrySelected: any = { icon: '', name: '' };
  public profileImage: any;
  public countries : any;
  public countriesCopy : any;
  public modulesList : any ;
  public themes = [];
  public newTheme: INewTheme;
  public userRoles =  GlobalConstants.systemSettings['userRoles'];
  public globalDateFormat = GlobalConstants.globalDateFormat;
  public userDetails: any = {
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
    language: "",
    defaultModule:"",
    defaultTheme:"",
    groupsToBeAdded: [],
    groupsToBeRemoved: [],
    rolesToBeAdded: [],
    rolesToBeRemoved: [],

  }
  constructor(private themeService: ThemeBuilderService, private commonServicesService : CommonServicesService,  private translateService: TranslateService, private userService: UserService, private utilitiesService: UtilitiesService ,public dialogRef: MatDialogRef<PreferencesComponent>,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.dateAdapter.setLocale(this.globalDateFormat.Abbreviation)
  }

  ngOnInit() {
    GlobalConstants.systemsettingsData['General Settings'].forEach(element => {
      if(element.name  ==='Default Module'){
        this.modulesList = element.options;
      }
      if (element.section.toLowerCase()  === 'theme') {
          this.themes.push({themeName: element.name, themeId: element.settingId});
      }

    });
    this.getCoustriesList();
    this.getCurrentUserData();
    this.userId = GlobalConstants.systemSettings['ehubObject']['userId'];
  }
 public changeTheme(themeName, themeId): void {
    if ( this.userId ) {
      this.newTheme = {
        userId: this.userId,
        selected: true,
        themeName,
        themeId
      };
    }
 }

  getCurrentUserData() {
    let userId: any  = GlobalConstants.systemSettings['ehubObject']['userId'];
    this.userService.getUserById(userId)
      .then((response: any) => {
        if (response.status && response.status == "success") {
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
          this.userDetails.userStatus = user.statusId ? user.statusId.listItemId : null;
          this.userDetails.firstName = user.firstName ? user.firstName : null;
          this.userDetails.middleName = user.middleName ? user.middleName : null;
          this.userDetails.lastName = user.lastName ? user.lastName : null;
          this.userDetails.screenName = user.screenName ? user.screenName : null;
          this.userDetails.emailAddress = user.emailAddress ? user.emailAddress : null;
          this.userDetails.dob = user.dob ? new Date(user.dob) : null;
          this.userDetails.country = (user.countryId && user.countryId.listItemId) ? user.countryId.listItemId : null;
          this.userDetails.jobTitle = user.jobTitle ? user.jobTitle : null;
          this.userDetails.extension = user.extension ? user.extension : null;
          this.userDetails.phoneNumber = user.phoneNumber ? user.phoneNumber : null;
          this.userDetails.department = user.department ? user.department : null;
          this.userDetails.language = user.language ? user.language : null;
          this.userDetails.defaultModule = user.defaultModule ? user.defaultModule : null;
          // this.userDetails.rolesToBeAdded = [];
          // this.userDetails.rolesToBeRemoved = [];
          // this.userDetails.groupsToBeAdded = [];
          // this.userDetails.groupsToBeRemoved = [];
          this.userDetails.defaultTheme = user.defaultTheme ? user.defaultTheme : null;
          this.countrySelected['icon'] = (user.countryId && user.countryId.code) ? user.countryId.code.toLowerCase() : null;
          this.countrySelected['name'] = (user.countryId && user.countryId.displayName) ? user.countryId.displayName : null;
          // this.userCreateSpinner = false;
        }
      })
      .catch((error) => {
        // this.userCreateSpinner = false;
        throw error;
      })
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

  updatePreferences(){
    this.userService.updatePreferences(GlobalConstants.systemSettings['ehubObject']['userId'], this.userDetails)
    .then((UserResponse: any) => {
      if ( UserResponse && UserResponse.status && UserResponse.status == "success") {
        this.utilitiesService.openSnackBar("success", this.translateService.instant('Preferences updated successfully'));
        // this.userCreateSpinner = false;
        let userObj = localStorage.getItem('ehubObject');
            if(userObj){
                userObj = JSON.parse(userObj);
                userObj['language'] = this.userDetails.language;
                userObj['defaultTheme'] = this.userDetails.defaultTheme;
                localStorage.setItem('ehubObject',JSON.stringify(userObj));
            }

            const cb = () => {
              // TODO: consider updating the selected language without the page reloading.
              // this.dialogRef.close();
              location.reload();
            }

        if (this.newTheme && this.newTheme.themeName) {
          this.themeService.applyTheme(this.newTheme, true, cb);
        } else {
          cb();
        }
        // location.reload();
        //    let themeApplied = new Promise((resolve,reject)=>{
        //     GlobalConstants.systemsettingsData['General Settings'].forEach((val,index) => {
        //       if(val.section == "Theme"){
        //         let usrObj = JSON.parse(localStorage.getItem('ehubObject'))
        //         if (usrObj['defaultTheme'] == null) {
        //             if (val.defaultValue) {
        //                 this.themeSettingsOfDefaultTheme(val).then(()=> resolve(true));
        //                 if (val.defaultValue == "Light Theme") {
        //                     $('body').addClass('light-dark-theme')
        //                 }
        //                 else {
        //                     $('body').removeClass('light-dark-theme')
        //                 }
        //             }
        //         }
        //         else {
        //             if (val.name == usrObj['defaultTheme']) {
        //                 this.themeSettingsOfDefaultTheme(val).then(()=> resolve(true));
        //                 if (usrObj['defaultTheme'] == "Light Theme") {
        //                     $('body').addClass('light-dark-theme')
        //                 }
        //                 else {
        //                     $('body').removeClass('light-dark-theme')
        //                 }
        //             }
        //         }
        //       }
        //       else if(GlobalConstants.systemsettingsData['General Settings'].length - 1 == index) resolve(true);
        //    })
        //
        //     // if (val.section.toLowerCase() === "regional settings") {
        //     //     let userObj = JSON.parse(localStorage.getItem('ehubObject'))
        //     //     val.selectedValue = (userObj && userObj.language) ?   userObj.language : val.selectedValue  ;
        //     //     var key = val.selectedValue.slice(0, 3).toLowerCase();
        //     //     var filename = key + '_identity_management.json'
        //     //     var param = {
        //     //         "fileName": filename,
        //     //         "languageName": val.selectedValue,
        //     //     };
        //     //     UploadFileService.getDownloadJsonDataByModule(param).then(function (response) {
        //     //         $rootScope.LanguageSelectedJsonData = response.data;
        //     //     })
        //     // }
        //     });
        // // this.dialogRef.close();
        // themeApplied.then(()=>{
        //     location.reload();
        //   })
      }
      else {
        this.utilitiesService.openSnackBar("error", (UserResponse && UserResponse.responseMessage) ? UserResponse.responseMessage : null );
        // this.userCreateSpinner = false;
      }
    }).catch((err) => {
      this.utilitiesService.openSnackBar("error", this.translateService.instant('Unexpected error'));
      // this.userCreateSpinner = false;
    });
  }

  themeSettingsOfDefaultTheme(theme) {
    return new Promise((resolve, reject) => {
      this.commonServicesService.getThemeById(theme.settingId).then((response) => {
        if (response) {


          var newVariableCss = {
            "--primary": "#ec480c",
            "--surface": "#172f09",
            "--backGround": "#035728",
            "--textOnPrimary": "#510600",
            "--textOnSurface": "#6cff62",
            "--textPrimaryOnSurface": "#0f2411",
            "--informationAlert": "#007ad9",
            "--errorAlert": "#CB323C",
            "--warningAlert": "#F26C0E",
            "--successAlert": "#00796B",
            "--fontFamily": "'Open Sans', sans-serif, sans-serif",
            "--smComponentCornerRadius": "10px",
            "--lgComponentCornerRadius": "30px",
          };

          localStorage.setItem("theme", JSON.stringify(newVariableCss));
          for (var element in newVariableCss) {
            if (element == "--fontFamily") {
              var body = document.body;
              body.classList.remove(
                "font-roboto",
                "font-opensans",
                "font-lato",
                "font-montserrat",
                "font-notoSans"
              );
              // body.classList.add(newVariableCss[element]);
            }
            document.documentElement.style.setProperty(
              element,
              newVariableCss[element]
            );
          }



          // var variableCss = response;
          // localStorage.setItem('theme', JSON.stringify(variableCss));
          // resolve(true);
          // for (var element in variableCss) {
          //   if (element == "fontFamily") {
          //     var body = document.body;
          //     body.classList.remove('font-roboto', 'font-opensans', 'font-lato', 'font-montserrat', 'font-notoSans');
          //     body.classList.add(variableCss[element]);
          //   }
          //   document.documentElement.style.setProperty('--' + element, variableCss[element]);
          // }
        }
      }, (error) => {
      })
    })
  }

  public trackByListItemId(_, item): string {
    return item.listItemId;
  }

  public trackByAttributeValue(_, item): string {
    return item.attributeValue;
  }

  public trackByThemeId(_, item): string {
    return item.themeId;
  }
  public trackByRoleName(_, item): string {
    return item.roleName;
  }
}
