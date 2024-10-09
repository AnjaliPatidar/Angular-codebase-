import { ColumnDefsModel, GridOptionsModel } from "../models/columnDefsAndRowData.model";
import { IconsRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/icons-renderer/icons-renderer.component';

export class SourceConstant {
    constructor(){}
    public gridOptionsConstatnt: GridOptionsModel = {
        'resizable': true,
        'tableName': 'Source list view',
        'columnDefs': [],
        'rowData': [],
        'rowStyle': { 'border-bottom': '#424242 1px solid' },
        'rowSelection': 'multiple',
        'floatingFilter': true,
        'animateRows': true,
        'sortable': true,
        'tabs': false,
        'isShoHideColumns': true,
        'multiSortKey': 'ctrl',
        'componentType': 'sources',
        'defaultGridName': 'Sources View',
        'cellClass': 'ws-normal',
        'changeBackground': "#ef5350",
        'rowModelType': 'clientSide',
        'enableTableViews': true,
        'cacheBlockSize': 10,
        'paginationPageSize': 10,
        'pagination': true,
        "enableServerSideFilter": true,
        "enableServerSideSorting": true,
        'filter': true,
        'enableCheckBoxes': false,
        'enableTopSection': true,
        'rowHeight': 53,
        'csvExportParams': {},
        'dateFilterProperties': {
          opensProperty: 'left',
          dropsPropertyType: 'down'
        }
    }
    public columnDefs: ColumnDefsModel[] = [
        {
            'headerName': 'Status',
            'field': 'Status',
            'colId': 'status',
            'width': 100,
            'singleClickEdit': true,
            'initialShowColumn': true,
            'floatingFilterComponent': 'singleSelectFilterComponent',
            'floatingFilterComponentParams': {
                'suppressFilterButton': true,
                'colId': 'status',
                'options': [
                    {
                        value: 100,
                        label: 'All'
                    },
                    {
                        value: 101,
                        label: 'Active'
                    },
                    {
                        value: 102,
                        label: 'Inactive'
                    },
                    {
                        value: 103,
                        label: 'Failed'
                    }
                ]
            },
            'filterParams': {
                'applyButton': true,
                'clearButton': true,
            },
            'cellRendererFramework': IconsRendererComponent,
            'customTemplateClass': 'source-status'
        },
        {
            'headerName': 'Source',
            'field': 'Source',
            'colId': 'source',
            'initialShowColumn': true,
            'width': 180,
            'filter': true,
            'sort': 'asc',
            'filterParams': {
                'applyButton': true,
                'clearButton': true,
                'filterOptions': ["contains", "notContains", "equals", "notEqual", "startsWith", "endsWith", "inRange"]
            },

        },
        {
            'headerName': 'URL',
            'field': 'URL',
            'colId': 'url',
            'width': 150,
            'initialShowColumn': true,
            'filter': true,
            'cellRenderer': 'agAnimateShowChangeCellRenderer',
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },

        },
        {
            'headerName': 'Jurisdiction',
            'field': 'Jurisdiction',
            'colId': 'jurisdiction',
            'initialShowColumn': true,
            'width': 150,
            'filter': true,
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'cellRendererFramework': IconsRendererComponent,
            'customTemplateClass': 'source-flags',
            'selectBoxListData': [],
            'floatingFilterComponent': 'multiSelectFilterComponent',
            'floatingFilterComponentParams': {
                'suppressFilterButton': true,
                'colId': 'jurisdiction',
                'options': []
            }

        },
        {
            'headerName': 'Category',
            'field': 'Category',
            'colId': 'category',
            'initialShowColumn': true,
            'width': 150,
            'filter': true,
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'selectBoxListData': [],
            'floatingFilterComponent': 'multiSelectFilterComponent',
            'floatingFilterComponentParams': {
                'suppressFilterButton': true,
                'colId': 'category',
                'options': []
            }

        },
        {
            'headerName': 'Domain',
            'field': 'Domain',
            'colId': 'domain',
            'initialShowColumn': false,
            'width': 150,
            'filter': true,
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'selectBoxListData': [],
            'floatingFilterComponent': 'multiSelectFilterComponent',
            'floatingFilterComponentParams': {
                'suppressFilterButton': true,
                'colId': 'domain',
                'options': []
            }

        },
        {
            'headerName': 'Industry',
            'field': 'Industry',
            'colId': 'industry',
            'initialShowColumn': false,
            'width': 150,
            'filter': true,
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'selectBoxListData': [],
            'floatingFilterComponent': 'multiSelectFilterComponent',
            'floatingFilterComponentParams': {
                'suppressFilterButton': true,
                'colId': 'industry',
                'options': []
            }

        },
        {
            'headerName': 'Last Update',
            'field': 'Last Update',
            'colId': 'last update',
            'initialShowColumn': true,
            'width': 150,
            'filter': 'agDateColumnFilter',
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'floatingFilterComponent': 'dateFilterComponent',
            'floatingFilterComponentParams': {
            'suppressFilterButton': true,
            'colId': 'Last Update',
            },
            'suppressMenu': true

        },
        {
            'headerName': 'Response Time',
            'field': 'Response Time',
            'colId': 'response time',
            'initialShowColumn': true,
            'width': 150,
            'filter': true,
            'filterParams': {
                'applyButton': true,
                'clearButton': true
            },
            'cellRendererFramework': IconsRendererComponent,
            'customTemplateClass': 'source-responce-time'
        }
    ];
    
}