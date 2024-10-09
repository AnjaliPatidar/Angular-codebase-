import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs'
import { RolesService } from '@app/modules/user-management/services/roles/roles.service';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { camelCase } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  isChecked: boolean;
  roleValue: any;
  children: Array<any>;
  ItemNode: TodoItemNode;
  isVisible :  boolean;
  object:any;
}



@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],

})
export class RolesPermissionsComponent implements OnInit {
  sortValue :string = "ASC";
  isTreeLoaded: boolean = false;
  updateTree:boolean = false;
  nodesSelected: Array<any> = [];
  currentRolePermissionsIds: Array<any> = [];
  permissionValues: any = {};
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  treedata: any = {};
  originalDataCopy: any = [];
  treeData :any;
  get data(): TodoItemNode[] { return this.dataChange.value; }
  initialize(treedata) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    const data = this.buildFileTree(treedata, 0);
    // Notify the change.
    this.dataChange.next(data);
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
  */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  currentRole: (string | number);
  currentRoleId: (string | number);
  separator: string = "!@#$%^&";
  constructor(
      private rolesService: RolesService,
      private route: ActivatedRoute,
      private utilitiesService: UtilitiesService,
      private ref: ChangeDetectorRef,
      private translateService: TranslateService
  ) {
    this.constructorInit();
  }
  constructorInit(){
    this.route.params.subscribe(params => {
      this.currentRole = decodeURIComponent(params['currentRole']);
      Promise.all([this.getAllPersmissions(), this.getRolePermissions()]).then((values) => {
        this.initialize(this.treedata);
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
        this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataChange.subscribe(data => {
          this.dataSource.data = data;
        });
        this.isTreeLoaded = true;
      });
      this.getRoleDetails(this.currentRole);
    });
  }
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  ngOnInit() {
  }
  allFlatNodes:any = [];
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.isChecked = false;//this.currentRolePermissionsIds.indexOf(node.item) == -1 ? false : true
    flatNode.children = node.children;
    flatNode.roleValue = this.permissionValues[node.item] ? this.permissionValues[node.item] : "0";
    flatNode.ItemNode = node;
    flatNode.isVisible = true;
    flatNode.object =  this.originalDataCopy[node.item];
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    this.allFlatNodes[flatNode.item] = flatNode;
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.ref.markForCheck();
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
    this.onPermissionSelect(node);
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  radioChanged(event: any, node: TodoItemFlatNode, nodeId: (string | number)) {
    node.roleValue =  node.roleValue;
    this.allFlatNodes[node.item]['roleValue'] = node.roleValue;
    /* mark all child radio buttons according to parent */
    let markRadio = (node: TodoItemNode, value: (string | number)) => {
      let recursive = (node: TodoItemNode) => {
        if (node.children && node.children.length > 0) {
          node.children.forEach((element: TodoItemNode) => {
              const existingNode = this.nestedNodeMap.get(element);
              const flatNode = existingNode && existingNode.item === element.item
                ? existingNode
                : new TodoItemFlatNode();
              flatNode.item = element.item;
              flatNode.expandable = !!element.children;
              flatNode.children = element.children;
              flatNode.roleValue = value;
              this.flatNodeMap.set(flatNode, element);
              this.nestedNodeMap.set(element, flatNode);
            recursive(element);
          });
        }
      }
      recursive(node);
    }
    markRadio(node, node.roleValue)
    //if (node.level != 0) {
      let mainParentNode = node;
      for (let i = node.level; i > 0; i--) {
        mainParentNode = this.getParentNode(mainParentNode);
        if (!this.checkSimilarValuesForChilds(mainParentNode)) {
          mainParentNode.roleValue = "3"
        } else {
          mainParentNode.roleValue = node.roleValue;
        }
        this.allFlatNodes[mainParentNode.item]['roleValue'] = mainParentNode.roleValue;
      }
    //}
    if(event){
      setTimeout(() => {
        this.permissionUpdate(node);
      }, 1000)
    }

  }

  formatDataToTree(originalData) {
    let temp = JSON.parse(JSON.stringify(originalData));
    temp.forEach((object, key) => {
      this.originalDataCopy[object.permissionId] = object;
    });

    function makeJson(a, parent) {
      var json = []
      a.filter(c => c.parentPermissionId === parent)
        .forEach(c => {
          let obj = makeJson(a, c.permissionId);
          if (Object.keys(obj).length > 0) {
            json[c.permissionId] = obj;
          }
          else {
            json[c.permissionId] = null;
          }
        });
      return json;
    }
    var final = makeJson(originalData, null);
    return final;

  }
  addPermission(params) {
    this.updateTree = true;
    this.rolesService.addPermission(params)
      .then((response: any) => {
        if (response && response.status && response.responseMessage) {
          this.updateTree = false;
          this.utilitiesService.openSnackBar(response.status, response.responseMessage);
        }
        else {
         this.updateTree = false;
          this.utilitiesService.openSnackBar("error", "unexpected error")
        }
      })
      .catch((err) => {
        this.updateTree = false;
        this.utilitiesService.openSnackBar("error", "unexpected error")
      })
  }

  permissionUpdate(node: TodoItemFlatNode,returnParams=false) {
    let params:any = [];

    params.push({
      "groupPrivilegeId" : this.getRolePermissionsArray[node['item']],
      //"groupId": 1004,
      "permissionId": parseInt(node['item']),
      "permissionLevel": parseInt(node['roleValue']),
      "roleId": this.currentRoleId,
    })
    this.getAllChildNodes(node['ItemNode']).forEach(element => {
      params.push({
        "groupPrivilegeId" : this.getRolePermissionsArray[element['item']],
       // "groupId": 1004,
        "permissionId": parseInt(element['item']),
        "permissionLevel": parseInt(element['roleValue']),
        "roleId": this.currentRoleId,
      });
    });
    if (node.level != 0) {
      let mainParentNode = node;
      for (let i = node.level; i > 0; i--) {
        mainParentNode = this.getParentNode(mainParentNode);
        params.push({
          "groupPrivilegeId" : this.getRolePermissionsArray[mainParentNode['item']],
          //"groupId": 1004,
          "permissionId": parseInt(mainParentNode['item']),
          "permissionLevel": parseInt(mainParentNode['roleValue']),
          "roleId": this.currentRoleId,
        });
      }

    }
    if(returnParams){
      return params;
    }
    this.addPermission(params);


  }
  getRoleDetails(roleName) {
    this.rolesService.getRole({ roleName: roleName })
      .then((response) => {
        if (response && response['roleId']) {
          this.currentRoleId = response['roleId'];
        }
        else {
          this.utilitiesService.openSnackBar("error", "Invalid rolename");
        }
      })
      .catch((err) => {
        this.utilitiesService.openSnackBar("error", "something went wrong");
      })
  }
  getAllPersmissions() {
    let promise = new Promise((resolve, reject) => {
      this.rolesService.getPermissions()
        .then((response: any) => {
          let camelToTitleCase= (str)=> {
            return str.trim().split(' ').filter(s => s).reduce((acc, curr) => {
              if (curr.toUpperCase() === curr) {
              } else {
                curr = curr.replace(/^[A-Za-z]+\./, '');
                curr = curr
                    .replace('overView', ' overview ')
                    .replace('checkList', ' checklist ')
                    .replace('onBoarding', 'onboarding ')
                    .replace('ownerShip', ' ownership ').trim();
                curr = curr.includes('-') ? curr.replace('-', ' - ') : camelCase(curr).replace(/([A-Z])/g , " $1");
                curr = curr.charAt(0).toUpperCase() + curr.slice(1);
              }
              acc.push(curr);
              return acc;
            }, []).join(' ').trim().replace(/:\s*$/, '').trim();
          }
          const filterInPlace = (res, predicate) => {
            let end = 0;

            for (let i = 0; i < res.length; i++) {
                const obj = res[i];
               if(obj.parentPermissionId == 5028 ||obj.parentPermissionId == 5052 ||obj.parentPermissionId == 5076 ||obj.parentPermissionId == 5100 ||obj.parentPermissionId == 5124 ||obj.parentPermissionId == 5148 ||obj.parentPermissionId == 5004 ) {
                 if (obj.itemName == "sources") {
                   res[i].itemName = "Sources List"
                 }
                 else if (obj.itemName == "associatedDocuments") {
                   res[i].itemName = "Attachments"
                 } else {
                   res[i].itemName = camelToTitleCase(obj.itemName);
                 }
               } else {
                 res[i].itemName = camelToTitleCase(obj.itemName);
               }
               if(obj.parentPermissionId == 5013){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"
                res[i].parentPermissionId=5004
               }
               if(obj.parentPermissionId == 5037){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5028
               }
               if(obj.parentPermissionId == 5061){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5052
               }
               if(obj.parentPermissionId == 5085){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5076
               }
               if(obj.parentPermissionId == 5109){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5100
               }
               if(obj.parentPermissionId == 5133){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5124
               }
               if(obj.parentPermissionId == 5157){
                obj.itemName == "associatedDocumentsStickyNotes" ? res[i].itemName= "Notes" : res[i].itemName="Documents"

                res[i].parentPermissionId= 5148
               }
                if (predicate(obj)) {
                    res[end++] = obj;
                }
                res[i].itemName = this.translateService.instant(res[i].itemName);
            }

            res.length = end;
        };

        const toDelete = new Set([5057,5129,5105,5081,5033,5009,5153,5010,5034,5058,5082,5106,5130,5154,5011,5035,5059, 5083,5107,5131,5155,5012,5036,5060,5084,5108,5132,5156,5014,5038,5062,5086,5110,5134,5158,5015,5039,5063,5087,5111,5135,5159,5016,5040,5064,5088,5112,5136,5160]);


        filterInPlace(response, obj => !toDelete.has(obj.parentPermissionId));
          this.treedata = this.formatDataToTree(response);
          resolve("success");
        })
        .catch((err) => {
          reject([]);
        })
    });
    return promise;
  }
  public getRolePermissionsArray :any = [] ;
  getRolePermissions() {
    let promise = new Promise((resolve, reject) => {
      this.rolesService.getRolePermissions({ "roleName": this.currentRole })
        .then((response: any) => {
          JSON.parse(response.data).forEach((element)=>{
            if (element["permissionId"] && element["permissionId"]["permissionId"]) {
              this.getRolePermissionsArray[element["permissionId"]["permissionId"].toString()]  = element['groupPrivilegeId'];
            } else {
              console.log(element , "Missing permissionId!");
            }
          })
          JSON.parse(response.data).forEach(element => {
            if (element["permissionId"] && element["permissionId"]["permissionId"]) {
              this.currentRolePermissionsIds.push(element["permissionId"]["permissionId"].toString());
              this.permissionValues[element["permissionId"]["permissionId"].toString()] = element["permissionLevel"].toString();
            }
          });
          resolve("success");

        })
        .catch((err) => {
          resolve("error");
        })
    });
    return promise
  }
  getAllChildNodes(node: TodoItemNode) {
    let allValues: any = [];
    let recursive = (node: TodoItemNode) => {
      let status: boolean = true;
      if (node.children && node.children.length > 0) {
        node.children.forEach((element: TodoItemNode) => {
          const existingNode = this.nestedNodeMap.get(element);
          const flatNode = existingNode && existingNode.item === element.item
            ? existingNode
            : new TodoItemFlatNode();
          allValues.push(flatNode);
          recursive(element);
        });
      }
      return allValues;
    }
    return recursive(node);
  }
  getParentNodes(node) {
    let allNodes = [];
    let mainParentNode = node;
    for (let i = node.level; i > 0; i--) {
      mainParentNode = this.getParentNode(mainParentNode);
      allNodes.push(mainParentNode);
    }
    return allNodes;
  }
  updateCheckValueForParents(node,value){
    this.getParentNodes(node).forEach((node)=>{
      if(this.descendantsPartiallySelected(node)){
        node.isChecked = false;
      }
      else{
        node.isChecked = value;
      }
    });
  }
  updateCheckValueForChilds(node,value){
    let currentNode = node;
    this.getAllChildNodes(node.ItemNode).forEach((node)=>{
      node.isChecked = value
    })

  }




  /* batch operarions */
  onPermissionSelect(node: TodoItemFlatNode) {
      this.updateCheckValueForChilds(node,node.isChecked);
      this.updateCheckValueForParents(node,node.isChecked);
      let allNodes: Array<any> = [];
      allNodes = this.getAllChildNodes(node.ItemNode);
      this.getParentNodes(node).forEach((node)=>{
        allNodes.push(node);
      })
      allNodes.push(node);
      allNodes.forEach((node) => {
        if (node.isChecked && this.nodesSelected.indexOf(node) == -1) {
          this.nodesSelected.push(node);
        }
        if (!node.isChecked) {
          let nodeIndex = this.nodesSelected.indexOf(node);
          if (nodeIndex != -1) {
            this.nodesSelected.splice(nodeIndex, 1)
          }
        }

      })
  }
  deSelectAll(){
    this.nodesSelected.forEach((node)=>{
      node.isChecked =  false;
    })
    this.nodesSelected = [];
  }
  setRoleValue(value){
    let params = [];
    this.nodesSelected.forEach((node)=>{
      node.roleValue =  value;
      this.radioChanged(null,node,node.item);
      params =  params.concat(this.permissionUpdate(node,true));
    })
    let existNodes:any = [];
    let newParams = params.reverse();
    newParams = newParams.filter(function(item, pos) {
      if(existNodes.indexOf(item.permissionId) ==  -1){
        existNodes.push(item.permissionId);
        return item;
      }
      else{
        return false;
      }
    });
    this.addPermission(newParams);
  }
  checkSimilarValuesForChilds = (node: TodoItemFlatNode) => {
    /* check all values in array is same or not */
    let checkAllValuesAreSame = (array) => {
      if(array.length == 1){
        return true;
      }
      for (var i = 1; i < array.length; i++) {
        if (array[i] !== array[0])
          return false;
      }
      return true;
    }
    let allValues: any = [];
    // let recursive = (node: TodoItemNode) => {
    //   let status: boolean = true;
    //   if (node.children && node.children.length > 0) {
    //     node.children.forEach((element: TodoItemNode) => {
    //       const existingNode = this.nestedNodeMap.get(element);
    //       const flatNode = existingNode && existingNode.item === element.item
    //         ? existingNode
    //         : new TodoItemFlatNode();
    //       allValues.push(flatNode.roleValue);

    //       if (checkAllValuesAreSame(allValues)) {
    //         recursive(element);
    //       }
    //       else {
    //         status = false;
    //         return;
    //       }

    //     });
    //   }
    //   return status;
    // }
    let recursive = (node: TodoItemNode) => {
      let status: boolean = true;
      if (node.children && node.children.length > 0) {
        node.children.forEach((element: TodoItemNode) => {
          const existingNode = this.nestedNodeMap.get(element);
          const flatNode = existingNode && existingNode.item === element.item
            ? existingNode
            : new TodoItemFlatNode();
          allValues.push(flatNode.roleValue);
          recursive(element);
        });
      }
      return checkAllValuesAreSame(allValues);
    }
    return recursive(node);
  }

  duplicateDataSource :any;
  filter(filterText: string) {
    let visibleNodes = [];
    this.dataSource['treeControl']['dataNodes'].forEach((node)=>{
      node.isVisible =  false;
      if(this.originalDataCopy[node.item]['itemName'].indexOf(filterText) != -1 ){
        node.isVisible =  true;
        visibleNodes.push(node);
      }
    });
    visibleNodes.forEach((node)=>{
      this.getParentNodes(node).forEach((Pnode)=>{
        Pnode.isVisible =  true;
      });
      this.getAllChildNodes(node).forEach((childs)=>{
        childs.isVisible = true;
      });
    })

  }
  doSort(){
    this.isTreeLoaded = false;
    let prevData = JSON.parse(JSON.stringify(this.allFlatNodes));
    if(this.sortValue == "ASC"){
      this.sortValue = "DESC"
    }
    else{
      this.sortValue = "ASC"
    }
    let comparer =  (a :TodoItemNode, b :TodoItemNode) => {
      let aFlatNode = this.nestedNodeMap.get(a);
      let bFlatNode = this.nestedNodeMap.get(b);
      if(this.sortValue == "ASC"){
        return aFlatNode.object.itemName < bFlatNode.object.itemName ? -1 : 1;
      }
      else{
        return aFlatNode.object.itemName < bFlatNode.object.itemName ? 1 : -1;
      }
    };
    let sortRecursive =  (arr:any) => {
      arr = arr.sort(comparer);
        for (let i=0; i < arr.length; i++) {
          if(Array.isArray(arr[i]['children'])){
            arr[i]['children'] = sortRecursive(arr[i]['children']);
          }
        }
      return arr;
    };
    let newData = sortRecursive(this.dataSource.data);
    this.dataSource.data =  newData;
    this.dataSource._flattenedData.value.forEach((node)=>{
      node.roleValue = prevData[node.item].roleValue;
      node.isChecked = prevData[node.item].isChecked;
    });
    setTimeout(()=>{
      this.isTreeLoaded = true;
    },0)
  }

}
