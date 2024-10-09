import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Location} from '@angular/common';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';

interface IRouteData {
  themeName: string | null;
  themeId: string | null;
  allThemeNames: string[];
  defaultTheme: string;
  userId: string;
  isEdit: boolean;
  cssFile: Blob;
  navigationId?: number;
}

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['./theme-builder.component.scss'],
})
export class ThemeBuilderComponent implements OnInit, OnDestroy {
  public themeId: string | null = null;
  public defaultTheme: string;
  public themeName: string | null = null;
  public themesNames: string[] = [];
  public userID: string;
  public stylesValue?: Blob | string = null;
  public showLoader = false;

  constructor(
    private location: Location,
    private themeBuilderService: ThemeBuilderService,
    private renderer: Renderer2,
  ) {
    const routeData = this.location.getState() as IRouteData;
    delete routeData.navigationId;
    if (routeData.allThemeNames) {
      this.themeName = routeData.themeName;
      this.userID = routeData.userId;
      this.themeId = routeData.themeId;
      this.themesNames = routeData.allThemeNames;
      this.defaultTheme = routeData.defaultTheme;
      this.stylesValue = routeData.cssFile;
      localStorage.setItem('themeData', JSON.stringify(routeData));
    }
    this.renderer.addClass(document.body, 'bst-body-theme');
  }

  ngOnInit() {
    if (!this.userID) {
      this.getDataFromStorage();
    }
  }

  private getDataFromStorage() {
    const stored = localStorage.getItem('themeData');
    const themeData = stored == null ? undefined : JSON.parse(stored);
    if (themeData.userId && themeData.allThemeNames) {
      this.themesNames = themeData.allThemeNames;
      this.themeName = themeData.themeName;
      this.userID = themeData.userId;
      this.themeId = themeData.themeId;
      this.defaultTheme = themeData.defaultTheme;
      this.stylesValue = themeData.cssFile;
    } else {
      this.location.back();
    }
  }

  public handleThemeData(event: any) {
    if (event.detail.themeName) {
      this.showLoader = true;
      const data = {
        themeName: event.detail.themeName,
        themeId: this.themeId,
        userId: this.userID,
        selected: event.detail.apply || this.defaultTheme === event.detail.themeName,
      };
      const cssFile: Blob = event.detail.ccsFile;
      this.themeBuilderService.saveNewTheme(data, cssFile, data.selected);
    }
    console.log('Theme Builder output: ', event.detail.styles);
  }

  ngOnDestroy(): void {
    const localData: string = localStorage.getItem('themeData');
    if (localData) {
      localStorage.removeItem('themeData');
    }
    this.renderer.removeClass(document.body, 'bst-body-theme');
  }

}
