import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-relation-map",
  templateUrl: "./relation-map.component.html",
  styleUrls: ["./relation-map.component.scss"],
})
export class RelationMapComponent implements OnInit, AfterViewInit {
  @Input() relationData: any;
  // @ViewChild(NgCytoComponent, { static: false }) child;
  @ViewChild("chart", { static: false }) child;
  public vlaChartDataNotFound = false;
  public vlaZoomIn = 40;
  public showVla = false;
  public entityNetworkData: any;
  public searchEntityAndAttributes: any;
  public isLightTheme = false;
  public nodeBackgroundColour = "#2d2d2d";
  public fontColor = "#fff";
  public edgeFontColor = "#dbd9d9";
  public circle = true; // initial loading view
  public cose = false;
  public grid = false;
  public breadthfirst = false;
  public dagre = false;

  constructor() {}

  ngOnInit() {
    if (this.relationData) {
      this.vlaChartDataNotFound = false;
    }
    this.entityNetworkData = this.buildDataModal();
    this.showVla = true;
  }
  ngAfterViewInit() {}

  buildDataModal(): any {
    // get theme
    // debugger;

    let themeName = JSON.parse(localStorage.getItem("ehubObject")).theme;

    if (themeName === "Light Theme") {
      // light theme

      this.isLightTheme = true;
      this.nodeBackgroundColour = "#fff";
      this.fontColor = "black";
      this.edgeFontColor = "#363434";
    }

    const data = {};
    data["root"] = [];
    data["edges"] = [];
    data["nodes"] = [];

    let rootDataItem = this.relationData.rowData.find(
      (x) => x.Relation == "Self"
    );

    let mainNode = {
      data: {
        id: "person",
        name: rootDataItem.FullName,
        proprtyResolutionStrategy: "",
        colorCode: "#FFAD33",
        nodeBackgroundColour: this.nodeBackgroundColour,
        fontColor: this.fontColor,
        icon: "person_pin",
        weight: 100,
        shapeType: "ellipse",
        type: "EntityType",
        propertyName: "",
        isEntity: "entity",
        actualNodeData: {
          //  entity_attributes: [
          //    {
          //      name: "address",
          //      matching_method: "com.bst.namematcher.string",
          //      range: "http://www.w3.org/2001/XMLSchema#string",
          //    }
          //  ],
          label: rootDataItem.FullName,
          type: "EntityType",
        },
        onIntialLoad: true,
        isEdited: false,
      },
      classes: "nodeIcon",
    };
    data["nodes"].push(mainNode);

    const relationalData = this.relationData.rowData.filter(
      (x) => x.Relation !== "Self"
    );

    let counter1 = 2;
    let counter2 = 5001;

    relationalData.forEach((element) => {
      let icon = "person";
      let color = "#00796b";

      if (element.Relation.toLowerCase() === "works for") {
        icon = "work";
        color = "#ef5350";
      }
      let subNode = {
        data: {
          id: counter1.toString() + ":" + counter2.toString(),
          name: element.FullName,
          proprtyResolutionStrategy: "",
          icon: icon,
          colorCode: color,
          nodeBackgroundColour: this.nodeBackgroundColour,
          fontColor: this.fontColor,
          weight: 100,
          shapeType: "round-rectangle",
          type: "EntityType",
          propertyName: "",
          isEntity: "entity",
          actualNodeData: {
            //  entity_attributes: [
            //    {
            //      name: "address",
            //      matching_method: "com.bst.namematcher.string",
            //      range: "http://www.w3.org/2001/XMLSchema#string",
            //    }
            //  ],
            label: rootDataItem.FullName,
            type: "EntityType",
          },
          onIntialLoad: true,
          isEdited: false,
        },
        classes: "nodeIcon",
      };

      const nodeRelation = {
        data: {
          id: counter2.toString(),
          source: "person",
          target: counter1.toString() + ":" + counter2.toString(),
          colorCode: "#97979761",
          fontColor: this.edgeFontColor,
          isEntity: "attributes",
          label: this.titleCase(element.Relation),
        },
      };

      counter1++;
      counter2++;

      data["edges"].push(nodeRelation);
      data["nodes"].push(subNode);
    });

    return data;
  }

  callToMakeLayout(makelayout: string): void {
    this.resetLayoutSelection(makelayout);
    this.child.switchtoLayout(makelayout);
  }

  resetLayoutSelection(newLayout: string) {
    this.circle = false;
    this.cose = false;
    this.grid = false;
    this.breadthfirst = false;
    this.dagre = false;

    switch (newLayout) {
      case "circle":
        this.circle = true;
        break;

      case "cose":
        this.cose = true;
        break;

      case "grid":
        this.grid = true;
        break;

      case "breadthfirst":
        this.breadthfirst = true;
        break;

      case "dagre":
        this.dagre = true;
        break;

      default:
        this.circle = true;
    }
  }

  titleCase(stringToConvert: string) {
    const splitStr = stringToConvert.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(" ");
  }
  // method to zoom in network
  callZoomIn(e) {
    this.child.zoomOut(0.01);
  }

  // method to zoom out network
  callZoomOut(e) {
    this.child.zoomIn(0.01);
  }

  // method to fit network to screen
  callFitToScreen(e) {
    this.child.fittoScreen(e);
  }

  searchEntityAttr(ele) {
    this.child.searchFilter(ele);
  }
}
