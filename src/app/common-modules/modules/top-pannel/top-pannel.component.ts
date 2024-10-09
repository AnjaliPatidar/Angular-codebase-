import { Component, Inject, OnInit } from '@angular/core';
import { CommonServicesService } from '../../services/common-services.service';
import { AppConstants } from '../../../app.constant';
import { NgbTabsetConfig, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/modules/user-management/services/user.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from './modals/about/about.component';
import { PreferencesComponent } from './modals/preferences/preferences.component';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { UserSharedDataService} from '../../../shared-services/data/user-shared-data.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { WINDOW } from '../../../core/tokens/window';
@Component({
  selector: 'app-top-pannel',
  templateUrl: './top-pannel.component.html',
  styleUrls: ['./top-pannel.component.scss']
})

export class TopPannelComponent implements OnInit {
  public showHideTopPannelItems: any = {
    showHideClipBoard: false,
    showHideNotificalse: false,
    showHideUserProfile: false,
    showSticky: false
  }
  public globalDateFormat: any = {};
  public userName: any;
  public profileImage: any;
  public userDetails: any;

  public stickies: string[] = ['first', 'second', 'third', 'fourth'];
  public companyLogo:any = '';
  topPanelJson: any;
  LastLoginLabel ="";
  ProfileLabel = "";
  SettingsLabel = "";
  MyPreferencessLabel = "";
  ManageLabel = "";
  LogOutLabel = "";
  MyClipboardLabel = "";
  NotesLabel = "";
  FilesLabel = "";
  NoteLabel = "";
  UploadLabel = "";
  SearchLabel= "";
  SortbyLablel="";
  SharedStickyNoteLabel = "";
  MyStickyNotesLabel = "";
  DisplayLabel = ""
  ImageLabel=""
  SixthLabel=""
  SeventhLabel=""
  EighthLabel=""
  NinthLabel=""
  TenthLabel=""
  TextLabel=""
  PdfLabel=""
  SharedDocumentsLabel =""
  MyDocumentsLabel = ""
  AscendingLabel=""
  DecendingLabel=""
  IconsLabel=""
  TableLabel=""

  constructor(private _commonService : CommonServicesService,
             private config: NgbTabsetConfig,
             private popoverConfig: NgbPopoverConfig,
             private utilitiesService: UtilitiesService,
             private translateService: TranslateService,
             public userService: UserService,
             private activatedRoute:ActivatedRoute,
             public dialog: MatDialog,
             private userSharedDataService: UserSharedDataService,
             private _sharedServicesService:SharedServicesService,
             @Inject(WINDOW) private readonly window: Window
            ) {
            let dateformat = setInterval(() => {
                                if(GlobalConstants.globalDateFormat && Object.keys(GlobalConstants.globalDateFormat).length > 0){
                                  this.globalDateFormat = GlobalConstants.globalDateFormat;
                                  this.userDetails.lastLoginDate = this.userDetails.lastLoginDate ? moment(new Date(parseInt(this.userDetails.lastLoginDate)),this.globalDateFormat.ShortDateFormat.toUpperCase()+' '+this.globalDateFormat.LongTimeFormat).format(this.globalDateFormat.ShortDateFormat.toUpperCase()+' '+this.globalDateFormat.LongTimeFormat) : null;
                                  clearInterval(dateformat)
                                }
                              }
                              )
      config.type = 'pills';
      config.justify = 'fill';
      popoverConfig.autoClose = false;
  }

  private setUserDetailsFromLocalStorage(): void {
    this.userDetails = JSON.parse(localStorage.getItem('ehubObject'));
  }

  ngOnInit() {
    this.setUserDetailsFromLocalStorage();
    this.window.addEventListener('storage', (e) => {
      this.setUserDetailsFromLocalStorage();
    });

    this._commonService.getTopPanelJson().subscribe((value) => {
      if(value){
        this.topPanelJson = value;
      }else{
        this.getLanguage();
      }
        this.setLocalisationValues();
    });

    this.activatedRoute.url.subscribe(urldetails => {
      this.getBasicSettings();
    })
    this.userProfile();
    this._commonService.sticky.subscribe(stickyStatus => this.showHideTopPannelItems.showSticky = stickyStatus);
    this.updateLogo();
  }

  getLanguageKey(text) {
    var langKey = text;
    if (this.topPanelJson) {
      langKey = this.topPanelJson[text];
    }
    return langKey;
  }


  getLanguage(): void {
    if (GlobalConstants.systemSettings.ehubObject.language) {
      this.getLanguageData(GlobalConstants.systemSettings.ehubObject.language);
    } else {
      this._sharedServicesService.getSystemSettings().then(settings => {
        if (settings) {
          settings['General Settings'].map((val: any) => {
            if (val.name === 'Languages') {
              if (val.selectedValue) {
                this.getLanguageData(val.selectedValue);
              }
            }
          });
        }
      });
    }
  }

  getLanguageData(language: any): void {
    const key: 'en' | 'de' = this._commonService.get_language_name(language);
    const filename: string = key + '_top_pannel.json';
    const param: any = {
      fileName: filename,
      languageName: language
    };

    const url: string =
      AppConstants.Ehub_Rest_API +
      'fileStorage/downloadFileByLanguageAndFileName?fileName=' +
      param.fileName +
      '&languageName=' +
      param.languageName;

    this.translateService.use(url).subscribe(
      (res) => {
        this.topPanelJson=res;
        this._commonService.sendLanguageJsonToComponents(res);
      },
      (error) => {
        if (error.status === 404 && key === 'de') {
          this._sharedServicesService.showFlashMessage(
            'german file not found, loading default language..',
            'danger'
          );
          this.getLanguageData('english');
        } else if (error.status === 404 && key === 'en') {
          setTimeout(() => {
            this._sharedServicesService.showFlashMessage(
              'english file ' + error.url + ' is missing',
              'danger'
            );
          }, 3000);
        }
      }
    );
  }


  updateLogo() {
    this._commonService.LogoUpdated.subscribe((response) => {
      if(response){
        let imageFile = this.convertBase64ToJpeg(response)
        var reader = new FileReader();
        reader.onload = (e) => {
          this.companyLogo = e['target']['result'];
        };
        reader.readAsDataURL(imageFile);
      }
    })
  }

  userProfile() {
    let userId = JSON.parse(localStorage.getItem('ehubObject'))
    this.userSharedDataService.getUserDetails()
      .subscribe(response => {
            if ( response && response.status && response.status == "success") {
              let user = response.data ? response.data : {};
              this.userName = user.firstName.charAt(0) + user.lastName.charAt(0)
              if (user && user.userImage) {
                let imageFile = this.utilitiesService.convertBase64ToJpeg(user.userImage)
                var reader = new FileReader();
                reader.onload = (e: any) => {
                  this.profileImage = e.target.result
                };
                reader.readAsDataURL(imageFile);
              }
            }
          })
  }


  toggleTopPannelItems(type:string){
    this.showHideTopPannelItems.showHideClipBoard = type == "clipboard" ? !this.showHideTopPannelItems.showHideClipBoard : false;
    this.showHideTopPannelItems.showHideNotifications = type == "notification" ? !this.showHideTopPannelItems.showHideNotifications : false;
    this.showHideTopPannelItems.showHideUserProfile = type == "userProfile" ? !this.showHideTopPannelItems.showHideUserProfile : false;
    this.showHideTopPannelItems.showSitcky = false;
    if (type == "clipboard" && !this.showHideTopPannelItems.showHideClipBoard) {
      this.showHideTopPannelItems.showSticky = false;
      this._commonService.showHideSticky.next(this.showHideTopPannelItems.showSticky);
    }
  }

  logout() {
    let token = JSON.parse(localStorage.getItem("ehubObject"))['token'];
    localStorage.removeItem('ehubObject');
    localStorage.setItem("loggedout", "true");

    const logoutFromOtherModules$ = forkJoin([this._commonService.logoutFromKYCQuestionnaire(), this._commonService.logoutFromPolicyEnforcement()]);

    logoutFromOtherModules$.subscribe();

    this.window.location.href = JSON.parse(localStorage.getItem("paths"))['EHUB_API'] +"/security/logout?token=" + token;

  }

  toggleSticky() {
    this.showHideTopPannelItems.showSitcky = !this.showHideTopPannelItems.showSitcky;
    this._commonService.toggleSticky();
  }

  navigatePath(url: string){
    let paths: string = localStorage.getItem('paths');
    if (paths) {
      paths = JSON.parse(paths);
      this.window.location.href = paths['EHUB_FE_API'] + url;
    }
  }

  dataURItoBlob(dataURI) {
    const byteString = this.window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  blobToFile(imageBlob, imageName) {
    return new File([imageBlob], imageName, { type: 'image/jpeg' });
  }

  convertBase64ToJpeg(base64) {
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }

    const imageName = date + '.' + text + '.jpeg';
    const imageBlob = this.dataURItoBlob(base64);
    return this.blobToFile(imageBlob, imageName);
  }

  openAboutModal() {
    const dialogRef = this.dialog.open(AboutComponent, {
      width: '750px',
      panelClass: 'user-popover'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPreferencesModal() {
    const dialogRef = this.dialog.open(PreferencesComponent, {
      width: '750px',
      panelClass: 'user-popover',
      data: this.userDetails
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getBasicSettings() {
    this._commonService.getBasicSettings().subscribe(settings => {
      let basicUserSettingDetails = JSON.parse(settings['data']);
      let selectedLocalizationDeatils = {};
      let logoDetails = {};
      basicUserSettingDetails.filter((ele, ind) => {
        if (ele.hasOwnProperty('defaultValue') && ele.hasOwnProperty('section')) {
          if (ele['section'] == 'Branding') {
            logoDetails = ele;
            let imgSelected = logoDetails['customerLogoImage'] ? logoDetails['customerLogoImage'] : logoDetails['defaultValue'];
            let imageFile = this.convertBase64ToJpeg(imgSelected)
            var reader = new FileReader();
            reader.onload = (e) => {
              this.companyLogo = e['target']['result'];
            };
            reader.readAsDataURL(imageFile);
          }
        }
        return ele;
      });
    })
  }

  setLocalisationValues(){
    this.LastLoginLabel = this.getLanguageKey('LastLogin');
    this.ProfileLabel = this.getLanguageKey('Profile');
    this.SettingsLabel = this.getLanguageKey('Settings');
    this.MyPreferencessLabel = this.getLanguageKey('MyPreferencess');
    this.ManageLabel = this.getLanguageKey('Manage');
    this.LogOutLabel = this.getLanguageKey('LogOut');
    this.MyClipboardLabel = this.getLanguageKey('MyClipboard');
    this.NotesLabel = this.getLanguageKey('notes');
    this.FilesLabel = this.getLanguageKey('files');
    this.NoteLabel = this.getLanguageKey('Note');
    this.UploadLabel = this.getLanguageKey('Upload');
    this.SearchLabel = this.getLanguageKey('Search');
    this.SortbyLablel = this.getLanguageKey('Sort by');
    this.SharedStickyNoteLabel = this.getLanguageKey('SharedStickyNotes');
    this.MyStickyNotesLabel = this.getLanguageKey('MyStickyNotes');
    this.SixthLabel = this.getLanguageKey('Sixth');
    this.SeventhLabel = this.getLanguageKey('Seventh');
    this.EighthLabel = this.getLanguageKey('Eighth');
    this.NinthLabel = this.getLanguageKey('Ninth');
    this.TenthLabel = this.getLanguageKey('Tenth');
    this.TextLabel = this.getLanguageKey('Text');
    this.PdfLabel = this.getLanguageKey('Pdf');
    this.ImageLabel = this.getLanguageKey('Image');
    this.MyDocumentsLabel = this.getLanguageKey('MyDocuments');
    this.DisplayLabel = this.getLanguageKey('Display');
    this.SharedDocumentsLabel = this.getLanguageKey('SharedDocuments');
    this.AscendingLabel = this.getLanguageKey('Ascending');
    this.DecendingLabel = this.getLanguageKey('Decending');
    this.IconsLabel = this.getLanguageKey('Icons');
    this.TableLabel = this.getLanguageKey('Table');
  }
}
