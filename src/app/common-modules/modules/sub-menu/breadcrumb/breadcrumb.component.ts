import { Component, OnInit, Input } from "@angular/core";
import { Location } from "@angular/common";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { SharedServicesService } from "@app/shared-services/shared-services.service";
import { CommonServicesService } from "@app/common-modules/services/common-services.service";
import { GlobalConstants } from "@app/common-modules/constants/global.constants";
import { TransactionMonitoringService } from "@app/modules/transaction-monitoring/tm-alert-card/services/transaction-monitoring.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  public moduleName: string = "";
  public breadcrumbList: Array<any> = [];
  public breadcrumbs: any = [];
  public languageJson: any = {};
  public lastChild: string = "";
  public childBreadCrum: string = "";
  private count: number = null;
  private initialRoute: string = "";
  public routerLink: string = "";
  public singleBreadcrumb: boolean;
  public userMangeChild: any = [];
  public links: any = [];
  isLightTheme = false;
  isLinkCLickable: boolean;
  @Input() InitialModuleName: string;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private _sharedServices: SharedServicesService,
    private cmnSrvc: CommonServicesService,
    private tmService: TransactionMonitoringService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.moduleName = this.location.path().split("/")[2];
    this.cmnSrvc.behaveObserverForgetLanguageJson.subscribe((resp) => {
      if (resp != undefined && resp && typeof resp == "object") {
        let keys = Object.keys(resp);
        keys.forEach((key) => {
          this.languageJson[key] = resp[key];
        });
        this.onloadSettings();
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onloadSettings();
      }
    });
  }

  onloadSettings() {
    this.routerLink = this.location.path();
    this.userMangeChild = this.location.path().split("/");
    if (this.moduleName == "user-management") {
      this.links = [];
      let link = "/element/user-management/manage/" + this.userMangeChild[4];
      this.links.push(
        {
          link: link,
          name:
            this.userMangeChild[4] && this.userMangeChild[4][0]
              ? this.userMangeChild[4][0].toUpperCase() +
                this.userMangeChild[4].substring(1)
              : "",
        },
        { name: decodeURIComponent(this.userMangeChild[6]) }
      );
      this.breadcrumbList = this.location.path().split("/");
      this.count = this.userMangeChild.length;
      this.lastChild = this.userMangeChild[this.count - 1];
      this.initialRoute = "/element/" + this.moduleName;
    } else {
      this.links = [];
      for (let i = 3; i < this.userMangeChild.length; i++) {
        this.links.push({
          name: this.userMangeChild[i] ? this.userMangeChild[i] : "",
        });
      }
      this.breadcrumbList = this.location.path().split("/");
      this.count = this.userMangeChild.length;
      this.lastChild = this.userMangeChild[this.count - 1];
      this.initialRoute = "/element/" + this.moduleName;
    }
    let childBreadCrum;
    switch (this.moduleName) {
      case "alert-management": {
        console.log("this.lastChild")
        console.log(this.lastChild)
        if (
          this.lastChild === "alertsList" ||
          this.lastChild.indexOf("alertsList") !== -1
        ) {
          childBreadCrum = this.getLanguageKey("AlertsList");
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("AlertManagement"),
              path: this.initialRoute + "/alertsList",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        } else if (this.lastChild === "alertView") {
          childBreadCrum = this.getLanguageKey("Alert Details");
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("AlertManagement"),
              path: this.initialRoute + "/alertsList",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        } else if (this.lastChild === "feedList") {
          childBreadCrum = this.getLanguageKey("FeedList");
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("FeedManagement"),
              path: this.initialRoute + "/feedList",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        } else if (
          this.lastChild === "accordianList" &&
          this.singleBreadcrumb === true
        ) {
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("QuitEditingMode"),
              path: this.initialRoute + "/alertsList",
              icon: "arrow-left",
            },
          ];
        } else if (this.lastChild === "accordianList") {
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("AlertManagement"),
              path: this.initialRoute + "/alertsList",
            },
            {
              name: this.getLanguageKey("EntityName"),
              path: this.initialRoute + "/accordianList",
            },
          ];
        } else if (this.lastChild === "queueList") {
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("QueueManagement"),
              path: this.initialRoute + "/queueList",
            },
          ];
        }

        break;
      }
      case "system-monitoring": {
        if (this.lastChild === "sources") {
          (childBreadCrum = this.getLanguageKey("SourcesMonitoring")),
            (this.breadcrumbs = [
              {
                name: this.getLanguageKey("SystemMonitoring"),
                path: this.initialRoute + "/Sources Monitoring",
                parent: this.getLanguageKey("Manage"),
              },
            ]);
        }
        break;
      }
      case "entity": {
        if (this.lastChild.indexOf("compliance") !== -1) {
          (childBreadCrum = this.getLanguageKey("Advancedsearch")),
            (this.breadcrumbs = [
              {
                name: this.getLanguageKey("Advancedsearch"),
                path: this.initialRoute + "/compliance",
                parent: "Enrich",
              },
            ]);
        }
        break;
      }
      case "sourceManagement": {
        (childBreadCrum = this.getLanguageKey("SourceManagement")),
          (this.breadcrumbs = [
            {
              name: this.getLanguageKey("SourceManagement"),
              path: this.initialRoute + "/sourceManagement",
              parent: this.getLanguageKey("Manage"),
            },
          ]);
        break;
      }
      case "case-management": {
        if (this.lastChild === "caseList") {
          childBreadCrum = this.getLanguageKey("CaseList");
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("CaseManagement"),
              path: this.initialRoute + "/caseList",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        } else if (this.lastChild === "caseDashboard") {
          childBreadCrum = this.getLanguageKey("caseDashboard");
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("CaseManagement"),
              path: this.initialRoute + "/caseDashboard",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        } else if (parseInt(this.lastChild)) {
          this.isLinkCLickable = true;
          if (this.lastChild.indexOf("?") != -1) {
            this.lastChild = this.lastChild.substring(
              0,
              this.lastChild.indexOf("?")
            );
          }
          childBreadCrum = this.getLanguageKey("Case") + " " + this.lastChild;
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("CaseManagement"),
              path: this.initialRoute + "/caseList",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        }
        break;
      }
      case "transaction-monitoring": {
        if (
          this.lastChild === "alertCard" ||
          this.userMangeChild.indexOf("alertCard") !== -1
        ) {
          childBreadCrum = "Alert Card";
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("Transaction Monitoring"),
              path: this.initialRoute + "/alertCard",
              parent: this.getLanguageKey("Discover"),
            },
          ];
        }
        break;
      }
      case "transaction-monitoring": {
        if (
          this.lastChild === "alertCard" ||
          this.userMangeChild.indexOf("alertCard") !== -1
        ) {
          childBreadCrum = "Alert Card";
          this.breadcrumbs = [
            {
              name: this.getLanguageKey("Transaction Monitoring"),
              path: this.initialRoute + "/alertCard",
              parent: this.getLanguageKey("Discover"),
            },
          ];
          this.tmService
            .getAlertCard(this.lastChild)
            .subscribe(
              (res) => (this.childBreadCrum = res.eventName || "Alert Card")
            );
        }
        break;
      }
      case "list-management": {
        this.breadcrumbs = [
          {
            name: this.getLanguageKey("List Management"),
            path: this.initialRoute + "/list-management",
            parent: this.getLanguageKey("Manage"),
          },
        ];
        break;
      }
      default: {
        this.breadcrumbs = [
          {
            name: "System Settings",
            path: this.initialRoute + "/process",
            parent: this.getLanguageKey("Manage"),

            // name: "Element test",
            // path: this.initialRoute + "/process",
          },
        ];
        break;
      }
    }

    this.childBreadCrum = childBreadCrum;
  }

  /**Getting Language text
   * Author : karnakar
   * Date : 20-Jan-2020
   */
  getLanguageKey(text) {
    var langKey = "";
    let isAllFilesLoaded =
      GlobalConstants.localizationFiles &&
      GlobalConstants.localizationFiles.isTopPanelLoaded &&
      GlobalConstants.localizationFiles.isSubmenuLoaded
        ? true
        : false;
    if (this.languageJson !== undefined && isAllFilesLoaded) {
      langKey = this.languageJson[text];
      if (langKey) {
        return langKey;
      } else {
        return this.translateService.instant(text);
      }
    } else {
      return this.translateService.instant(text);
    }
  }

  public trackByPath(_, item): string {
    return item.path;
  }

  public trackByName(_, item): string {
    return item.name;
  }
}
