import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConstants } from '@app/app.constant';
import { DocumentIframeData } from '../models/document-iframe-data.model';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';

@Component({
  selector: 'app-document-dashboard',
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.scss']
})
export class DocumentDashboardComponent {

  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, private themeService: ThemeBuilderService) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(AppConstants.Document_FE);
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent): void {
    if (e.data && e.data === 'DMS READY') {
      const iframe = document.getElementById('documentIframe');
      if (iframe) {
        const data: DocumentIframeData = {
          ehubObject: localStorage.getItem('ehubObject'),
          paths: localStorage.getItem('paths'),
          theme: this.themeService.selectedTheme,
        };
        const iWindow = (<HTMLIFrameElement>iframe).contentWindow;
        iWindow.postMessage(data, AppConstants.Document_FE);
      }
    }
  }

}
