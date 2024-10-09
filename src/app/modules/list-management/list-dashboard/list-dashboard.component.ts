import { Component, HostListener } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppConstants } from '@app/app.constant';
import { ListIframeData } from '../models/list-iframe-data.model';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.scss']
})
export class ListDashboardComponent {

  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, private themeService: ThemeBuilderService) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(AppConstants.List_FE);
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent): void {
    if (e.data && e.data === 'LMS READY') {
      const iframe = document.getElementById('listIframe');
      if (iframe) {
        const data: ListIframeData = {
          langKey: localStorage.getItem('langKey'),
          ehubObject: localStorage.getItem('ehubObject'),
          paths: localStorage.getItem('paths'),
          domain: localStorage.getItem('domain'),
          theme: this.themeService.selectedTheme || localStorage.getItem('theme') ?  JSON.parse(localStorage.getItem('theme')) : '',
        };
        const iWindow = (<HTMLIFrameElement>iframe).contentWindow;
        iWindow.postMessage(data, AppConstants.List_FE);
      }
    }
  }

}
