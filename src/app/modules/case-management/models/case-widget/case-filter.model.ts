export interface KeyValueItem {
  key: string;
  value: string;
}

export interface WidgetMasterDataResponse {
  series: {
    entity: {entity_type: KeyValueItem, status: KeyValueItem[]}[];
    widget_type: any[];
  };
  titles: {
    show_data_labels: boolean;
    show_xaxis_sub_title: boolean;
    show_yaxis_sub_title: boolean;
    widget_name: string;
    x_axis_sub_title: string;
    y_axis_sub_title: string;
  };
  widget_entities: WidgetMasterEntity[];
}

export interface WidgetMasterEntity {
  entity_type: KeyValueItem;
  x_axis: {
    group_by: KeyValueItem;
    groupby_type: KeyValueItem[];
    number_of_periods?: number;
  }[];
  y_axis: {
    attributes: {
      aggregation_type: any[];
      attribute: KeyValueItem[];
    };
  };
}
