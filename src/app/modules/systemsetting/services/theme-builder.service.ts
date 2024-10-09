import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, defer, Observable} from 'rxjs';
import {Theme} from '@app/modules/systemsetting/models/system-settings/theme.model';
import {DOCUMENT} from '@angular/common';
import {GeneralSettingsApiService} from '@app/modules/systemsetting/services/generalsettings.api.service';
import {SharedServicesService} from '@app/shared-services/shared-services.service';
import {ThemeBuilderApiService} from '@app/modules/systemsetting/services/theme-builder-api.service';
import {catchError, mergeMap, retry, take, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThemeBuilderService {
  private themesOfUser$ = new BehaviorSubject<Theme[]>([]);
  public selectedTheme: Theme = null;
  private appliedThemeName$ = new BehaviorSubject<string>('Dark Theme');
  private renderer: Renderer2;
  private newThemeId: string;
  // temp default style for different environment compatibility
  private defaultStyle = {
    primary: '#3eb6ff',
    textOnPrimary: '#fbfbfb',
    backGround: '#383838',
    textOnBackground: '#fbfbfb',
    surface: '#2d2d2d',
    textOnSurface: '#fbfbfb',
    inputGroup: 'rgba(251,251,251,.08)',
    informationAlert: '#000000',
    errorAlert: '#ef5350',
    warningAlert: '#e6ae20',
    successAlert: '#00796b',
    fontFamily: 'font-roboto',
    rootFontSize: '10px',
    componentCornerRadius: '10px',
    selected: false,
  };
  private defaultLight = {
    primary: '#ffcc33',
    textOnPrimary: '#000000',
    backGround: '#eaeaea',
    textOnBackground: '#000',
    surface: '#ffffff',
    textOnSurface: '#000000',
    inputGroup: 'rgba(0,0,0,.1)',
    informationAlert: '#000000',
    errorAlert: '#ef5350',
    warningAlert: '#e6ae20',
    successAlert: '#00796b',
    fontFamily: 'font-gotham',
    rootFontSize: '10px',
    componentCornerRadius: '0px',
    selected: false
  };

  constructor(
    private generalSettingsApiService: GeneralSettingsApiService,
    private sharedService: SharedServicesService,
    private themeBuilderApiService: ThemeBuilderApiService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public setThemesOfUser(themes: any[]) {
    this.themesOfUser$.next(themes);
  }

  public getThemesOfUser(): Observable<any[]> {
    return this.themesOfUser$.asObservable();
  }

  public setAppliedThemeName(theme: string) {
    this.appliedThemeName$.next(theme);
  }

  public getAppliedThemeName(): Observable<string> {
    return this.appliedThemeName$.asObservable();
  }

  public saveThemeData(thData: Theme): Observable<any> {
    return defer(() => this.generalSettingsApiService.saveTheme(thData));
  }

  private saveThemeToS3(file: Blob) {
    return this.themeBuilderApiService.uploadFile(file, this.newThemeId).pipe(
      retry(2),
      catchError((err) => this.handleError)
    );
  }

  public getThemes(userId, newThemeName?: string): Observable<Theme[]> {
    const getTheme$ = defer(() => this.generalSettingsApiService.getThemes({userId}));
    return getTheme$.pipe(
      retry(2),
      catchError(() => this.handleError))
      .pipe(
        tap((userThemes: Theme[]) => {
          this.updateThemesState(userThemes, newThemeName || null);
        }));
  }

  private updateThemesState(userThemes: Theme[], newThemeName?: string) {
    this.setThemesOfUser(userThemes);
    userThemes.forEach((themeItem: Theme) => {
      if (themeItem.selected) {
        this.setAppliedThemeName(themeItem.themeName);
        this.selectedTheme = themeItem;
      }
      // get id of new theme
      if (newThemeName && themeItem.themeName === newThemeName) {
        this.newThemeId = themeItem.themeId.toString();
      }
    });
  }

  public saveNewTheme(thData: any, file: Blob, applyVal?) {
    const theme: Theme = {...this.defaultStyle, ...thData};
    // save to DB
    this.saveThemeData(theme)
      .pipe(
        mergeMap((resp: string) => {
          return this.getThemes(thData.userId, thData.themeName);
        }),
        catchError(() => this.handleError))
      .pipe(
        // save to S3 bucket
        mergeMap((userThemes: Theme[]) => {
          return this.saveThemeToS3(file);
        }),
        retry(2),
        catchError((err) => this.handleError)
      )
      .subscribe(
        (response: any) => {
          this.sharedService.showNewFlashMessage(
            `Theme: ${thData.themeName} successfully saved`,
            'success'
          );
          if (applyVal) {
            this.setDefaultTheme(thData.themeName, thData.userId, thData.themeId || this.newThemeId);
          }
        },
        (err) => {
          this.sharedService.showNewFlashMessage(err.error.responseMessage, '');
        }
      );
  }

  public applyTheme(thData: any, apply?, cb?: () => void) {
    const theme: Theme =
      thData.themeName === 'Light Theme' ? {...this.defaultLight, ...thData} : {...this.defaultStyle, ...thData};
    this.saveThemeData(theme).subscribe(
      (response: any) => {
        this.sharedService.showNewFlashMessage(
          response.responseMessage,
          'success'
        );
        cb && cb();
        this.updateDefaultTheme(theme);
        if (apply) {
          this.setDefaultTheme(thData.themeName, thData.userId, thData.themeId);
        }
      },
      (err) => {
        this.handleError(err);
      }
    );
  }

  private updateDefaultTheme(themeData: Theme) {
    const tmpThemes = this.themesOfUser$.getValue();
    tmpThemes.map((t: Theme) => {
      if (t.themeName === themeData.themeName) {
        t.selected = true;
        this.selectedTheme = t;
        this.setAppliedThemeName(t.themeName);
      } else {
        t.selected = false;
      }
    });
    this.setThemesOfUser(tmpThemes);
  }

  public setDefaultTheme(themeName: string, userId: string, themeId?: string): void {
    if (!themeName) {
      return;
    }
    if (this.appliedThemeName$.getValue() !== themeName) {
      this.setAppliedThemeName(themeName);
    }
    if (themeName === 'Light Theme') {
      document.body.classList.add('light-dark-theme');
      this.removeRemoteStyles();
      return;
    } else {
      document.body.classList.remove('light-dark-theme');
    }
    if (themeName !== 'Dark Theme') {
      this.applyRemoteStyles(userId, themeId);
    } else {
      this.removeRemoteStyles();
    }
  }

  public removeRemoteStyles() {
    const element = document.getElementById('client-theme') as HTMLElement;
    if (element) {
      this.renderer.removeChild(this.document.body, element);
    }
  }

  public applyRemoteStyles(userID: string, themeId?: string): void {
    this.themeBuilderApiService.getStyle(themeId, userID).subscribe({
      next: (preSignUrl) => {
        const styleContainer = (document.getElementById('client-theme') as HTMLElement) || this.renderer.createElement('link');
        this.renderer.setProperty(styleContainer, 'id', 'client-theme');
        this.renderer.setProperty(styleContainer, 'rel', 'stylesheet');
        this.renderer.setProperty(styleContainer, 'href', preSignUrl);
        this.renderer.appendChild(this.document.body, styleContainer);
      },
      error: (error: any) => console.warn('fileLoad is failed: ', error),
    });

  }

  public deleteTheme(theme: Theme) {
    let tmpThemesOfUser = this.themesOfUser$.getValue();
    tmpThemesOfUser = tmpThemesOfUser.filter((t: Theme) => {
      return t.themeName !== theme.themeName;
    });
    // if custom theme was default, first apply Dark Theme
    if (theme.themeName === this.appliedThemeName$.getValue()) {
      const darkTheme: Theme = tmpThemesOfUser.find(theme => theme.themeName === 'Dark Theme');
      this.setAppliedThemeName(darkTheme.themeName);
      darkTheme.selected = true;
      this.selectedTheme = darkTheme;
      this.setThemesOfUser(tmpThemesOfUser);
      this.removeRemoteStyles();
      this.saveThemeData(darkTheme).subscribe(
        (res => {
          this.removeTheme(theme);
        }),
        (error => {
          this.handleError(error);
          this.getThemes(theme.userId).pipe(take(1)).subscribe();
        })
      );
      return;
    } else {
      this.setThemesOfUser(tmpThemesOfUser);
      this.removeTheme(theme);
    }
  }

  private removeTheme(theme: Theme) {
    Promise.all([
      this.themeBuilderApiService.removeStyle(theme.themeId.toString()).toPromise(),
      this.generalSettingsApiService.deleteThemes(theme.themeId)
    ]).then(
      (response) => {
        this.sharedService.showNewFlashMessage(
          'Theme is deleted successfully',
          'success'
        );
      }
    ).catch((reason: any) => {
      this.getThemes(theme.userId).pipe(take(1)).subscribe();
      this.handleError(reason);
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.sharedService.showNewFlashMessage(error.error.responseMessage || 'something went wrong, try again later', 'danger');
  }
}
