export interface GridOptionsModel{
    resizable: boolean,
    columnDefs:[]
    rowData:[],
    rowModelType:string,
    pagination:boolean,
    filter:boolean,

    tableName?:string,
    tabs?:boolean,
    isShoHideColumns?:boolean,
    componentType?:string,
    defaultGridName?:string,
    changeBackground?:string,
    enableTableViews?:boolean,
    enableTopSection?:boolean,
    rowStyle?:{},
    rowSelection?: string | boolean,
    floatingFilter?:boolean,
    animateRows?:boolean,
    sortable?:boolean,
    multiSortKey?:string | boolean,
    cellClass?:string,
    cacheBlockSize?:number,
    paginationPageSize?:number,
    enableServerSideFilter?:boolean,
    enableServerSideSorting?:boolean,
    enableCheckBoxes?:boolean,
    rowHeight?:number,
    csvExportParams?:any;
    dateFilterProperties: any;
}

export interface ColumnDefsModel{
    headerName:string,
    field:string,
    colId:string,
    width:number,
    initialShowColumn:boolean,
    sortable?:boolean,
    sort?:string | boolean,
    cellRendererFramework?:any,
    editable?:boolean,
    cellRenderer?:string,
    suppressMenu?:boolean,
    suppressSorting?:boolean,
    filter?:string | boolean,
    singleClickEdit?:boolean,
    cellEditor?:string,
    floatingFilterComponent?:string,
    filterParams?: FilterParams,
    customTemplateClass?:string,
    selectBoxListData?:[],
    cellEditorParams?:CellEditorParams,
    floatingFilterComponentParams?:FloatingFilterComponentParams
}

export interface FilterParams{
    applyButton?: boolean,
    clearButton?: boolean,
    filterOptions?:string[]
}

export interface CellEditorParams{
    values:[]
}
export interface FloatingFilterComponentParams{
    suppressFilterButton?: boolean,
    colId?: string,
    options?: any
}