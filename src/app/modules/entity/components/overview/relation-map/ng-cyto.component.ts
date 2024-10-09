import { Component, OnChanges, Renderer2, Input, Output, EventEmitter, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as edgehandles from 'cytoscape-edgehandles';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import dagre from 'cytoscape-dagre';
import * as $ from 'jquery';
cytoscape.use(contextMenus, $);
cytoscape.use(dagre);


// import * as from cy
import * as undoRedo from 'cytoscape-undo-redo';
cytoscape.use(undoRedo);
import * as nodeHtmlLabel from 'cy-node-html-label';

cytoscape.use(nodeHtmlLabel);
// import klay from 'cytoscape-klay';


@Component({
    selector: 'ng2-cytoscape',
    template: `
   <div id="cy"></div>
   `,
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }`
    ],
    encapsulation: ViewEncapsulation.None,
})


export class NgCytoComponent implements OnChanges, OnInit, OnDestroy {

    public cy: any;
    sourceTargetData: any = {};
    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;
    @Input() public isCancel: boolean;
    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveGraphData: EventEmitter<any> = new EventEmitter<any>();
    // @Output() getEdges: EventEmitter<any> = new EventEmitter<any>();
    // @Output() addNewNodeToData: EventEmitter<any> = new EventEmitter<any>();
    @Output() edgeTrigger: EventEmitter<any> = new EventEmitter<any>();

    // private isSaveOrCancel = new BehaviorSubject<boolean>(true);
    // isCancel = true;
    initialData: any = {};
    layoutname: any = 'circle';
    json: any;
    newAttribute: any; // { id: number; name: string; weight: number; colorCode: string; shapeType: string; type: string; }
    // newNode = { id: "47859329", name: 'newnode', weight: 100, colorCode: 'blue', shapeType: 'ellipse', type: 'person' };
    oldNodes: any;
    edgeData: any = {};
   // entityNetworkData: EntityNetworkDataTypes;
    intialLoad = true;
    zoomInlength: any = 1;
    ur;
    eles: any;

    public constructor(
        private renderer: Renderer2,
    //    public entintyNetworkService: EntintyNetworkService
    ) {

        this.zoom = this.zoom || {
            min: 0.1,
            max: 1.5
        };

        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            edgehandles(cytoscape, $);
        }

        this.style =
          this.style ||
          cytoscape
            .stylesheet()
            .selector("node")
            .css({
              // 'shape': 'data(shapeType)',
              // 'width': 'mapData(weight, 40, 80, 20, 60)',
              content: "data(name)",
              "text-valign": "bottom",
              // 'text-outline-width': 1,
              // 'text-outline-color': 'data(colorCode)',
              // 'background-color': 'data(colorCode)',
              color: "data(fontColor)",
              "font-size": 14,
              width: "62px",
              height: "62px",
              "background-color": "data(nodeBackgroundColour)",
              "overlay-opacity": 0,
              "border-width": 1,
              "border-opacity": 1,
              "text-margin-y": "8px",
              // 'background-opacity': 0.2,
              // 'background-image':(e)=>{
              //     if(e.data() && e.data().name && e.data().name.toLowerCase()=="person"){
              //         return 'assets/images/person.svg'
              //     } if(e.data() && e.data().name &&(e.data().name.toLowerCase()=="organization" || e.data().name.toLowerCase()=="company")){
              //         return 'assets/images/business-red.svg'
              //     }else if(e.data().isEntity){
              //         return 'assets/images/person.svg'
              //     }
              // },
              // 'border-color':(e)=>{
              //     if(e.data() && e.data().name && e.data().name.toLowerCase()=="person"){
              //         return '#4c7cff'
              //     }else if(e.data() && e.data().name && (e.data().name.toLowerCase()=="organization" || e.data().name.toLowerCase()=="company")){
              //         return '#00796b'
              //     }
              // },
            })
            .selector('node[id="person"]')
            .css({ "background-color": "data(nodeBackgroundColour)" })
            .selector('node[isEntity="entity"]')
            .css({
              // 'background-image':(e)=>{
              //     if(e.data() && e.data().icon){
              //         return `<span class='material-icons'>${e.data().icon}</span>`
              //     } else if(e.data().isEntity){
              //         return 'assets/images/person.svg'
              //     }
              // },
              "border-color": (e) => {
                if (e.data() && e.data().colorCode) {
                  return e.data().colorCode;
                } else {
                  return "#00796b";
                }
              },
            })
            .selector('node[isEntity="attributes"]')
            .css({
              // 'content': 'data(name)',
              "text-valign": "bottom",
              // 'shape': 'data(shapeType)',
              shape: "round-rectangle",
              color: "#fff",
              "font-size": 14,
              width: "62px",
              height: "62px",
              "background-color": "#2d2d2d",
              "overlay-opacity": 0,
              "border-width": 1,
              "border-opacity": 1,
              "text-margin-y": "8px",
            })
            // .selector('node[name="person"]')
            // .css({
            //     'background-image': 'assets/images/person.svg',
            //     'border-color': '#4c7cff',
            // })
            // .selector('node[name="company"]')
            // .css({
            //     'background-image': 'assets/images/business-red.svg',
            //     'border-color': '#00796b',
            // })
            // .selector('node[name="organization"]')
            // .css({
            //     'background-image': 'assets/images/business-red.svg',
            //     'border-color': '#00796b',
            // })
            .selector('node[isEntity="attributes"]')
            .css({
              "background-image": "assets/images/notifications.svg",
              "border-color": "#8661c6",
            })
            // .selector('node[type="pep"]')
            // .css({
            //     'background-image': 'assets/images/person-red.svg',
            //     'border-color': '#ef5350',
            // })
            // .selector('node[type="gender"]')
            // .css({
            //     'background-image': 'assets/images/list.svg',
            //     'border-color': '#4c7cff',
            // })
            .selector(":selected")
            .css({
              "border-width": 1,
              "border-color": "#4c7cff",
              "background-color": "#4c7cff",
              "background-opacity": 0.2,
            })
            .selector('node[isEntity="entity"]:selected')
            .css({
              "background-color": (e) => {
                if (e.data() && e.data().colorCode) {
                  return e.data().colorCode;
                } else {
                  return "#00796b";
                }
              },
              "border-color": (e) => {
                if (e.data() && e.data().colorCode) {
                  return e.data().colorCode;
                } else {
                  return "#00796b";
                }
              },
            })
            // .selector('[name="company"]:selected')
            // .css({
            //     'border-color': '#00796b',
            //     'background-color': '#00796b',
            // })
            // .selector('[name="company"]:selected')
            // .css({
            //     'border-color': '#00796b',
            //     'background-color': '#00796b',
            // })
            // .selector('[name="organization"]:selected')
            // .css({
            //     'border-color': '#00796b',
            //     'background-color': '#00796b',
            // })
            // .selector('[type="text"]:selected')
            // .css({
            //     'border-color': '#8661c6',
            //     'background-color': '#8661c6',
            // })
            // .selector('[name="pep"]:selected')
            // .css({
            //     'border-color': '#ef5350',
            //     'background-color': '#ef5350',
            // })
            .selector("edge")
            .css({
              "curve-style": "unbundled-bezier",
              // 'opacity': 0.666,
              width: 1,
              // 'width': 'mapData(strength, 70, 100, 2, 6)',
              "target-arrow-shape": "triangle",
              // 'line-dash-pattern': [6,3],
              // 'line-dash-offset':24,
              "line-color": "data(colorCode)",
              // 'line-style':'dashed',
              "source-arrow-color": "data(colorCode)",
              "target-arrow-color": "data(colorCode)",
            })
            .selector(":selected")
            .css({
              "border-width": 1,
            })
            .selector('edge[isEntity="entity"]')
            .css({
              // 'source-arrow-shape': 'triangle',
            })
            // .selector('edge[isEntity="pep"]')
            // .css({
            //     'line-style':'dashed',
            //     'line-dash-pattern': [6, 3],
            //     'line-dash-offset':24
            // })
            .selector("edge[label]")
            .css({
              content: "data(label)",
              // "text-rotation": "autorotate",
              width: 1,
              "text-margin-x": "0px",
              "text-margin-y": "0px",
              "font-size": "12px",
              // "text-border-color": "#333",
              // "text-background-color": "#14462500",
              // "text-background-shape": "roundrectangle",
              //  "text-background-opacity": 1,
              // "text-border-width": 1,
              // "text-background-padding": "8px",
              // "border-radius": "25px",
              // "font-weight": "lighter",
              "text-shadow": "2px 2px #1d1c1c",
              color: "data(fontColor)",
            })
            .selector(".background")
            .css({
              // "text-background-opacity": 1,
              // "color": "#fff",
              // "text-background-color": "#3cb0fb",
              // "text-background-shape": "roundrectangle",
              // "text-border-width": 1,
              // 'text-background-padding': '10px',
              // 'text-rotation': '0deg'
            })
            .selector("#ab")
            .css({
              "source-arrow-shape": "triangle-backcurve",
              "target-arrow-shape": "triangle-backcurve",
            })
            .selector("edge.questionable")
            .css({
              "line-style": "dotted",
              "target-arrow-shape": "diamond",
            })
            .selector(".faded")
            .css({
              opacity: 0.25,
              "text-opacity": 0,
            })
            .selector(".eh-handle")
            .css({
              "background-color": "#2d2d2d",
              // 'background-image': 'assets/images/notifications.svg',
              width: "24px",
              height: "24px",
              shape: "roundrectangle",
              "border-color": (e) => {
                if (e.data() && e.data().colorCode) {
                  return e.data().colorCode;
                } else {
                  return "#00796b";
                }
              },
              "overlay-opacity": 0,
              "border-width": 1, // makes the handle easier to hit
              "border-opacity": 1,
            })
            .selector(".eh-hover")
            .css({
              "background-color": "#4c7cff",
            })
            .selector(".eh-source")
            .css({
              "border-width": 1,
              // 'border-color': '#4c7cff'
            })
            .selector(".eh-target")
            .css({
              "border-width": 1,
              // 'border-color': '#4c7cff'
            })
            .selector(".eh-preview, .eh-ghost-edge")
            .css({
              // 'background-color': '#4c7cff',
              "line-color": "#979797",
              "target-arrow-color": "#979797",
              "source-arrow-color": "#979797",
            })
            .selector(".eh-ghost-edge.eh-preview-active")
            .css({
              opacity: 0,
              "border-width": 1,
            })
            .selector(".autorotate")
            .css({
              "edge-text-rotation": "autorotate",
            });

    }

    ngOnInit() {
        // setTimeout(() => {
        this.render();
        this.connectNodeAndEdges();
        this.entityAttributesCount();
        // }, 1000);
        // this.entintyNetworkService.sourceTargetDetails.subscribe(res => {
        //     if (res && res.length && res[1] && res[1].id && res[2] == "nodes") {
        //         let data
        //         if (res[1].isEntity == "entity") {
        //             data = res[1]
        //             if (data.onIntialLoad) {
        //                 data.isEdited = true;
        //             }
        //             let sourceEdge = this.cy.edges(`[target = "${data.id}"]`)
        //             let node = this.cy.nodes(`[id = "${data.id}"]`)
        //             if (node.data() && node.data().actualNodeData && node.data().actualNodeData.label && (node.data().actualNodeData.label != data.name)) {
        //                 this.cy.edges().forEach((ele) => {
        //                     if (ele && ele.data() && ele.data().onIntialLoad && ((ele.data().target && ele.data().target == data.id) || (ele.data().source && ele.data().source == data.id)) && ele.data().isEntity == 'entity') {
        //                         ele.data().isEdited = true;
        //                         //  this.cy.nodes().forEach((element)=>{
        //                         //     if(ele.data().source == element.data().id){
        //                         //          element.data().isEdited= true
        //                         //     }
        //                         // })
        //                     }
        //                 })
        //             }
        //             //
        //             //    data={
        //             //     id: res[1].id,
        //             //     name: res[1].name,
        //             //     weight: 100,
        //             //     colorCode: res[1].value,
        //             //     shapeType: res[1].shapeType,
        //             //     type: res[1].type,
        //             //     assingWorkflow: res[1].assingWorkflow,
        //             //     isEntity : "entity",
        //             //    }
        //         } else if (res[1].isEntity == "attributes") {
        //             data = res[1]
        //             // let node
        //             if (data.onIntialLoad) {
        //                 // this.cy.edges().forEach((ele)=>{
        //                 //     if(ele && ele.data() && ele.data().target && (ele.data().target == data.id)){
        //                 //          this.cy.nodes().forEach((element)=>{
        //                 //             if(ele.data().source == element.data().id){
        //                 //                  element.data().isEdited= true
        //                 //             }
        //                 //         })
        //                 //     }
        //                 // })
        //                 let edge = this.cy.edges(`[target = "${data.id}"]`)
        //                 let node = this.cy.nodes(`[id = "${edge.data().source}"]`)
        //                 node.data().isEdited = true

        //             }

        //             //    data={
        //             //     id: res[1].id,
        //             //     name: res[1].name,
        //             //     weight: 100,
        //             //     colorCode: res[1].value,
        //             //     shapeType: res[1].shapeType,
        //             //     type: res[1].attributeType,
        //             //     attributeType: res[1].attributeType,
        //             //     textType: res[1].textType,
        //             //     inheritColorType: res[1].inheritColorType,
        //             //     comparisionWeight: res[1].comparisionWeight,
        //             //     isEntity : "attributes"
        //             //    }
        //         }
        //         let nodeToBeUpdated = this.cy.nodes(`[id = "${res[1].id}"]`);
        //         if (data) {
        //             nodeToBeUpdated.data(data)
        //             // this.ur.do("add", nodeToBeUpdated);

        //         }
        //     }
        //     if (res && res.length && res[1] && res[1].id && res[2] == "edges") {

        //         let val = res[1]
        //         if (val.onIntialLoad && val.isEntity == "entity") {
        //             val.isEdited = true;
        //         }

        //         let edgeToBeUpdated = this.cy.edges(`[id = "${res[1].id}"]`);
        //         if (val) {
        //             edgeToBeUpdated.data(val)
        //         }
        //     }
        //     this.entityAttributesCount()

        // })

    }

    ngOnChanges(): any {

    }

    public render() {
        let cy_contianer = this.renderer.selectRootElement('#cy');
        this.cy = cytoscape({
            container: cy_contianer,
            // layout: {
            //     name: this.layoutname,
            //     padding: 10,
            //     randomize: false,
            // },

            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
            style: this.style,
            elements: this.elements,

        });
        const layout = this.cy.layout({
            name: this.layoutname,
            padding: 10,
            randomize: false
        });

        layout.run();
        // this.cy.edgehandles({
        //     handleNodes(node) {

        //         if (node._private.data.isEntity == 'attributes') {
        //             return false;
        //         } else {
        //             return true;

        //         }
        //     }, });
        // this.cy.on('tap', 'node', (e) => {
        //     // let node = e.target;
        //     this.json = this.cy.json();
        //     this.select.emit({ node: e, totalEntityData: this.json });
        // });
        // this.cy.on('tap', 'edge', (e) => {
        //     const edge = e.target;
        //     // this.select.emit(node);
        //     // if(edge._private.data.isEntity != "attributes"){
        //     this.edgeTrigger.emit(e);
        //     // }
        // });
        this.ur = this.cy.undoRedo({
            isDebug: true,
            undoableDrag: false,
        });
        this.entityAttributesCount();

        // this.cy.on("beforeDo", function (event, actionName, args) {
        //    this.ur.do("add", args);

        // })
        this.cy.nodeHtmlLabel([{
            query: '.nodeIcon',
            halign: 'center',
            valign: 'center',
            halignBox: 'center',
            valignBox: 'center',
            tpl: (data) => {
                return `<i class="material-icons" id="${data.name}icon" style="color:${data.colorCode ? data.colorCode : '#00796b'}">${data.icon ? data.icon : 'folder'}</i>`;
            }
        }, {
            query: '.attributeIcon',
            halign: 'top',
            valign: 'top',
            halignBox: 'right',
            valignBox: 'right',
            tpl: (data) => {
                if (data.mandatory) {
                    return `<i class="material-icons" id="${data.name}icon" style="color:#fff;font-size: 1.8rem;opacity:0.75">star</i>`;
                } else {
                    return '';
                }
            }
        }


    ]);
    }

    undoRedo() {
        this.ur.undo();
    }

    addNode() {
        const newData = { id: Date.now(), name: '', weight: 100, colorCode: '#00796b', icon: 'folder', shapeType: 'ellipse', type: 'person', isEntity: 'entity', onIntialLoad: false };
        const ele = this.cy.add({
            group: 'nodes',
            data: newData,
            classes: 'nodeIcon',
            position: {
                x: Math.floor(Math.random() * (350 - 100 + 1)) + 100,
                y: Math.floor(Math.random() * (300 - 100 + 1)) + 100
            }
        });
        this.ur.do('add', ele);
        this.entityAttributesCount();
    }

    addAttribute() {
        this.newAttribute = { id: Date.now(), name: 'newAttribute', weight: 100, colorCode: '#0000FF', shapeType: 'round-rectangle', dataType: 'string', type: 'attributes', isEntity: 'attributes', comparisionWeight: 0 };
        const ele = this.cy.add({
            group: 'nodes',
            data: this.newAttribute,
            classes: 'attributeIcon',
            position: {
                x: Math.floor(Math.random() * (350 - 100 + 1)) + 100,
                y: Math.floor(Math.random() * (300 - 100 + 1)) + 100
            }
        });
        this.ur.do('add', ele);
        this.entityAttributesCount();
    }

    connectNodeAndEdges() {
        this.cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
            for (const val of addedEles) {
                const entityType = {
                    sourceType: val._private.source._private.data.isEntity,
                    targetType: val._private.target._private.data.isEntity
                };
                let isEntity;
                //  if(entityType.sourceType == "pep" ||  entityType.targetType == "pep"){
                //     isEntity = "pep"
                //  }else if((entityType.sourceType == "person" &&  entityType.targetType == "company") || (entityType.sourceType == "company" &&  entityType.targetType == "person") || (entityType.sourceType == "company" &&  entityType.targetType == "company") || (entityType.sourceType == "person" &&  entityType.targetType == "person")){
                //     isEntity = "person"
                //  }else{
                //     isEntity = "attributes"
                //  }
                if (sourceNode.data().onIntialLoad && sourceNode.data().isEntity == 'entity' && targetNode.data().isEntity == 'attributes') {
                    sourceNode.data().isEdited = true;
                }
                const label = '';
                if (entityType.sourceType == 'entity' && entityType.targetType == 'entity') {
                    isEntity = 'entity';
                    // label ="entityRelation"
                } else {
                    isEntity = 'attributes';
                }
                const data = { id: val._private.data.id, source: val._private.data.source, target: val._private.data.target, label, colorCode: '#979797', strength: 10, isEntity, onIntialLoad: false };

                const newEdge = this.cy.edges(`[id = "${val._private.data.id}"]`);
                this.ur.do('add', newEdge);
                newEdge.data(data);
                // newEdge.addClass("background")
                // this.getEdges.emit(val._private.data);

            }
        });
    }

    removeNode(e) {
        if (e.isEntity == 'attributes' && e.onIntialLoad) {
            const edge = this.cy.edges(`[target = "${e.id}"]`);
            if (edge && edge.data()) {
                const node = this.cy.nodes(`[id = "${edge.data().source}"]`);
                node.data().isEdited = true;
            }
        }

        const eles = this.cy.$(':selected');
        this.ur.do('remove', eles);
        eles.remove();
        this.entityAttributesCount();
    }
    removeEdge(e) {
        const eles = this.cy.edges(`[id = "${e.id}"]`);
        this.ur.do('remove', eles);
        eles.remove();
        this.entityAttributesCount();
        // this.json = this.cy.json();
    }

    switchtoLayout(makelayout: string) {
        this.layoutname = makelayout;
        const layout = this.cy.layout({
            name: this.layoutname,
            padding: 20
        });
        layout.run();
    }

    saveGraph() {
        this.json = this.cy.json();
        this.saveGraphData.emit(this.json);
    }

    zoomIn(e) {
        this.zoomInlength = this.zoomInlength + e;
        this.cy.zoom({
            level: this.zoomInlength,
            position: { x: 200, y: 200 }
        });

    }
    entityAttributesCount() {
        if (this.cy && this.cy.json()) {
            this.json = this.cy.json();
            let entityCount = [], attributeCount = [];
            if (this.json && this.json.elements && this.json.elements.nodes) {
                entityCount = this.json.elements.nodes.filter((val) => val.data.isEntity == 'entity');
                attributeCount = this.json.elements.nodes.filter((val) => val.data.isEntity == 'attributes');
            }
            document.getElementById('entitiesAndAttributes').innerText = `${entityCount.length} Entities, ${attributeCount.length} Attributes`;
        }
    }
    zoomOut(e) {

        this.zoomInlength = this.zoomInlength - e;
        this.cy.zoom({
            level: this.zoomInlength,
            position: { x: 200, y: 200 }
        });
    }

    fittoScreen(e) {
        const layout = this.cy.layout({
            name: 'preset',
            fitToScreen: true
        });
        layout.run();
        this.zoomInlength = 1;

    }
    undoDelete(e) {
        this.ur.undo();
        this.entityAttributesCount();
    }
    addorUpdateEdge(res) {

    }
    resetAll() {
        this.ur.undoAll();
    }
    redoDelete(e) {
        this.ur.redo();
        this.entityAttributesCount();
    }
    searchFilter(value) {
        this.cy.nodes().forEach((ele, i, eles) => {
            if (ele.data().name && ele.data().name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                const icon = document.getElementById(ele.data().name + 'icon');
                if (icon) {
                    icon.style.display = 'block';
                }
                ele.style('display', 'element');
            } else {

                ele.style('display', 'none');
                const icon = document.getElementById(ele.data().name + 'icon');
                if (icon) {
                    icon.style.display = 'none';
                }
            }
        });
    }
    addNodesEdgesPredefined(addNodesEdgesPredefined) {
        if (addNodesEdgesPredefined && addNodesEdgesPredefined.nodes) {
            addNodesEdgesPredefined.nodes.forEach(element => {
                const ele = this.cy.add({
                    group: 'nodes',
                    classes: element.data.isEntity == 'entity' ? 'nodeIcon' : 'attributeIcon',
                    data: element.data,
                    position: {
                        x: Math.floor(Math.random() * (350 - 100 + 1)) + 100,
                        y: Math.floor(Math.random() * (300 - 100 + 1)) + 100
                    }
                });
                this.ur.do('add', ele);
            });
        }
        if (addNodesEdgesPredefined && addNodesEdgesPredefined.edges) {
            addNodesEdgesPredefined.edges.forEach(element => {
                const ele = this.cy.add({
                    group: 'edges',
                    data: element.data,
                });
                this.ur.do('add', ele);
            });
        }
        // cose
        this.layoutname = 'dagre';
        const layout = this.cy.layout({
            name: this.layoutname,
            padding: 20
        });
        layout.run();
        this.entityAttributesCount();
    }
    ngOnDestroy() {
      //  this.entintyNetworkService.sourceTargetDetails.next([]);
    }
}


