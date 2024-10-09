import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {GlobalConstants} from '@app/common-modules/constants/global.constants';
import {ThemeBuilderService} from '@app/modules/systemsetting/services/theme-builder.service';
import {ThemeBuilderApiService} from '@app/modules/systemsetting/services/theme-builder-api.service';
import {Theme} from '@app/modules/systemsetting/models/system-settings/theme.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-theme-management',
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss'],
})
export class ThemeManagementComponent implements OnInit, OnDestroy {
  public themes: Theme[];
  private userId: string;
  private defaultTheme: string;
  private allThemeNames: string [];
  private readonly onDestroy = new Subject();

  constructor(
    public themeBuilderService: ThemeBuilderService,
    public themeApiService: ThemeBuilderApiService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  @Input() systemSettingObject: any;
  @Input() permissionIds: any;

  ngOnInit(): void {
    if (localStorage.getItem('ehubObject')) {
      GlobalConstants.ehubObject = JSON.parse(
        localStorage.getItem('ehubObject')
      );
    }
    this.userId = GlobalConstants.ehubObject.userId;
    this.themeBuilderService.getThemes(this.userId).subscribe( res => {},
      err => console.log('getThemes HTTP Error', err));
    this.themeBuilderService.getAppliedThemeName().pipe(takeUntil(this.onDestroy))
      .subscribe((themeName: string) => {
        this.defaultTheme = themeName;
      });
    this.themeBuilderService.getThemesOfUser().pipe(takeUntil(this.onDestroy))
      .subscribe((themes: Theme[]) => {
      this.themes = themes;
      const themesNames = [];
      themes.forEach((theme: Theme) => {
          if (theme.selected) {
            this.themeBuilderService.setAppliedThemeName(theme.themeName);
          }
          themesNames.push(theme.themeName);
        });
      this.allThemeNames = themesNames;
      });
  }

 public applyTheme(theme: Theme) {
    const data = theme;
    data.selected = true;
    this.themeBuilderService.applyTheme(data, true);
  }

  public deleteTheme(theme: Theme) {
      this.themeBuilderService.deleteTheme(theme);
  }

  public navigateToThemeBuilder(theme?: Theme) {
    const data = {
      userId: this.userId,
      themeId: null,
      allThemeNames: this.allThemeNames,
      defaultTheme: this.defaultTheme,
      themeName: null,
      cssFile: null
    };
    if (theme) {
      this.themeApiService.getStyle(theme.themeId.toString(), this.userId).pipe(
          mergeMap((url: string) => {
          return this.http.get(url, {responseType: 'text'});
        })).subscribe((cssFile: Blob | string) => {
        data.themeName = theme.themeName;
        data.themeId = theme.themeId;
        data.cssFile = cssFile;
        this.openThemBuilder(data);
      });
    } else {
      this.openThemBuilder(data);
    }
  }
private openThemBuilder(data) {
  this.router.navigate(['./theme-builder'], {
    relativeTo: this.route,
    state: data
  });
}

trackByThemeName(_, item): string {
  return item.themeName;
}
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
