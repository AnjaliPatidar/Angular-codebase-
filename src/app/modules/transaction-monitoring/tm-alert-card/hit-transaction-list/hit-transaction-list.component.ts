import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITMAlertTrnAttributes, ITMAlertHitTransaction } from '../models/alert-hit-transaction.model';
import { TransactionMonitoringService } from '../services/transaction-monitoring.service';
import { map } from 'lodash-es';
import * as moment from 'moment';

@Component({
  selector: 'app-hit-transaction-list',
  templateUrl: './hit-transaction-list.component.html',
  styleUrls: ['./hit-transaction-list.component.scss']
})
export class HitTransactionListComponent implements OnInit {

  columnDefs: any[] = [];
  public gridOptions: any = {};
  public componentName = 'alertTransactionList';
  componentThis = this;
  public title = 'List of Events';

  constructor(
    private tmService: TransactionMonitoringService,
    public dialogRef: MatDialogRef<HitTransactionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {hitId: string, hitName: string}) {
      if (data.hitName) {
        this.title = `${data.hitName} - List of Events`
      }
    }

  ngOnInit() {
    this.columnDefs.push(

    {
      headerName: 'Transaction ID ',
      field: 'event_id',
      colId: 'event_id',
      dbKey: 'event_id',
      minWidth: 300,
      initialShowColumn: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Transaction Date & Time ',
      field: 'event_time',
      colId: 'event_time',
      dbKey: 'event_time',
      minWidth: 300,
      initialShowColumn: true,
      filter: 'agDateColumnFilter',
      'filterParams': {
        'applyButton': true,
        'clearButton': true,
          comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {

            if (!cellValue) {
              return 0;
            }

            //since filter only supports date component
            const currentDate = new Date(cellValue);
            filterLocalDateAtMidnight.setHours(currentDate.getHours())
            filterLocalDateAtMidnight.setMinutes(currentDate.getMinutes())
            filterLocalDateAtMidnight.setSeconds(currentDate.getSeconds())

            if (currentDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (currentDate > filterLocalDateAtMidnight) {
              return 1;
            }
            return 0;
        }
      },
      'cellRenderer': (data) => {return data.value ? moment.utc(data && data.value ? data.value : '').local().format('MM-DD-YYYY HH:mm:ss'): ''},
    },
    {
      headerName: 'Transaction Type ',
      field: 'transaction_type',
      colId: 'transaction_type',
      dbKey: 'transaction_type',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Debit-Credit Indicator ',
      field: 'transaction_debit_credit_indicator',
      colId: 'transaction_debit_credit_indicator',
      dbKey: 'transaction_debit_credit_indicator',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Customer Account Number ',
      field: 'transaction_customer_account_number',
      colId: 'transaction_customer_account_number',
      dbKey: 'transaction_customer_account_number',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Counterparty Account Number / IBAN ',
      field: 'transaction_counterparty_account_number',
      colId: 'transaction_counterparty_account_number',
      dbKey: 'transaction_counterparty_account_number',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Counterparty Account SORT Code / BIC ',
      field: 'transaction_counterparty_account_sort_code',
      colId: 'transaction_counterparty_account_sort_code',
      dbKey: 'transaction_counterparty_account_sort_code',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Origination Transaction Amount ',
      field: 'origination_transaction_amount',
      colId: 'origination_transaction_amount',
      dbKey: 'origination_transaction_amount',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Destination Transaction Amount ',
      field: 'destination_transaction_amount',
      colId: 'destination_transaction_amount',
      dbKey: 'destination_transaction_amount',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Counterparty Name ',
      field: 'transaction_counterparty_name',
      colId: 'transaction_counterparty_name',
      dbKey: 'transaction_counterparty_name',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Counterparty Transaction Country ',
      field: 'transaction_counterparty_country',
      colId: 'transaction_counterparty_country',
      dbKey: 'transaction_counterparty_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'From Transaction Currency ',
      field: 'transaction_from_currency',
      colId: 'transaction_from_currency',
      dbKey: 'transaction_from_currency',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'To Transaction Currency ',
      field: 'transaction_to_currency',
      colId: 'transaction_to_currency',
      dbKey: 'transaction_to_currency',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transfer Method ',
      field: 'transfer_method',
      colId: 'transfer_method',
      dbKey: 'transfer_method',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction Channel ',
      field: 'transaction_channel',
      colId: 'transaction_channel',
      dbKey: 'transaction_channel',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction Location (Country) ',
      field: 'transaction_country',
      colId: 'transaction_country',
      dbKey: 'transaction_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction IP Address ',
      field: 'transaction_IP_address',
      colId: 'transaction_IP_address',
      dbKey: 'transaction_IP_address',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction Comments ',
      field: 'transaction_comments',
      colId: 'transaction_comments',
      dbKey: 'transaction_comments',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'First Transaction ',
      field: 'transaction_first',
      colId: 'transaction_first',
      dbKey: 'transaction_first',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction Amount ',
      field: 'transaction_amount',
      colId: 'transaction_amount',
      dbKey: 'transaction_amount',
      minWidth: 300,
      initialShowColumn: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Transaction Type Code ',
      field: 'transaction_type_code',
      colId: 'transaction_type_code',
      dbKey: 'transaction_type_code',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Transaction Status Code ',
      field: 'transaction_status_code',
      colId: 'transaction_status_code',
      dbKey: 'transaction_status_code',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Product Business Unit ',
      field: 'product_business_unit',
      colId: 'product_business_unit',
      dbKey: 'product_business_unit',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Product Number ',
      field: 'product_number',
      colId: 'product_number',
      dbKey: 'product_number',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Product Category ',
      field: 'product_category',
      colId: 'product_category',
      dbKey: 'product_category',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Product Type ',
      field: 'product_type',
      colId: 'product_type',
      dbKey: 'product_type',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Prodcut Sub Type ',
      field: 'product_sub_type',
      colId: 'product_sub_type',
      dbKey: 'product_sub_type',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Internal Customer Identifier ',
      field: 'organization_identifier',
      colId: 'organization_identifier',
      dbKey: 'organization_identifier',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Business Unit ',
      field: 'organization_business_unit',
      colId: 'organization_business_unit',
      dbKey: 'organization_business_unit',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Name ',
      field: 'organization_name',
      colId: 'organization_name',
      dbKey: 'organization_name',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Domiciled In ',
      field: 'organization_domiciled_in',
      colId: 'organization_domiciled_in',
      dbKey: 'organization_domiciled_in',
      minWidth: 100,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Industry-Type-business code ',
      field: 'organization_business_code',
      colId: 'organization_business_code',
      dbKey: 'organization_business_code',
      minWidth: 100,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Postal Coutnry ',
      field: 'organization_postal_country',
      colId: 'organization_postal_country',
      dbKey: 'organization_postal_country',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Country ',
      field: 'organization_country',
      colId: 'organization_country',
      dbKey: 'organization_country',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Organization Registered Jurisdiction Country ',
      field: 'organization_registered_country',
      colId: 'organization_registered_country',
      dbKey: 'organization_registered_country',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Internal Customer Identifier ',
      field: 'person_Identifier',
      colId: 'person_Identifier',
      dbKey: 'person_Identifier',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Business Unit ',
      field: 'person_business_unit',
      colId: 'person_business_unit',
      dbKey: 'person_business_unit',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Given Name ',
      field: 'person_given_name',
      colId: 'person_given_name',
      dbKey: 'person_given_name',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Family Name ',
      field: 'person_family_name',
      colId: 'person_family_name',
      dbKey: 'person_family_name',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Nationality ',
      field: 'person_nationality',
      colId: 'person_nationality',
      dbKey: 'person_nationality',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Shipping Country ',
      field: 'person_shipping_country',
      colId: 'person_shipping_country',
      dbKey: 'person_shipping_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Delivery Method Country ',
      field: 'person_delivery_method_country',
      colId: 'person_delivery_method_country',
      dbKey: 'person_delivery_method_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Home Country ',
      field: 'person_home_country',
      colId: 'person_home_country',
      dbKey: 'person_home_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Office Country ',
      field: 'person_office_country',
      colId: 'person_office_country',
      dbKey: 'person_office_country',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Date of Birth ',
      field: 'person_birth_date',
      colId: 'person_birth_date',
      dbKey: 'person_birth_date',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Type ',
      field: 'person_alert_type',
      colId: 'person_alert_type',
      dbKey: 'person_alert_type',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Person Expected KYC Amount ',
      field: 'person_expected_KYC_amount',
      colId: 'person_expected_KYC_amount',
      dbKey: 'person_expected_KYC_amount',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Business Unit ',
      field: 'account_business_unit',
      colId: 'account_business_unit',
      dbKey: 'account_business_unit',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Identification ',
      field: 'account_Identifier',
      colId: 'account_Identifier',
      dbKey: 'account_Identifier',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Currency ',
      field: 'account_currency',
      colId: 'account_currency',
      dbKey: 'account_currency',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Opening Date ',
      field: 'account_opening_date',
      colId: 'account_opening_date',
      dbKey: 'account_opening_date',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Closing Date ',
      field: 'account_closing_date',
      colId: 'account_closing_date',
      dbKey: 'account_closing_date',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Live Date ',
      field: 'account_live_date',
      colId: 'account_live_date',
      dbKey: 'account_live_date',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Balance ',
      field: 'account_balance',
      colId: 'account_balance',
      dbKey: 'account_balance',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Party Type ',
      field: 'account_party_type',
      colId: 'account_party_type',
      dbKey: 'account_party_type',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Account Party Type Relationship ',
      field: 'account_relationship',
      colId: 'account_relationship',
      dbKey: 'account_relationship',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Status ',
      field: 'account_status',
      colId: 'account_status',
      dbKey: 'account_status',
      minWidth: 300,
      initialShowColumn: true,
    },
    {
      headerName: 'Minor Account Flag ',
      field: 'account_minor_flag',
      colId: 'account_minor_flag',
      dbKey: 'account_minor_flag',
      minWidth: 50,
      initialShowColumn: true,
    },
    {
      headerName: 'Sub Account Flag ',
      field: 'account_sub_account_flag',
      colId: 'account_sub_account_flag',
      dbKey: 'account_sub_account_flag',
      minWidth: 50,
      initialShowColumn: true,
    },
    {
      headerName: 'Parent Account ',
      field: 'account_parent_flag',
      colId: 'account_parent_flag',
      dbKey: 'account_parent_flag',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Other Identifiers ',
      field: 'account_other_identifiers',
      colId: 'account_other_identifiers',
      dbKey: 'account_other_identifiers',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Primary Account Owners ',
      field: 'account_primary_owner',
      colId: 'account_primary_owner',
      dbKey: 'account_primary_owner',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'Secondary Account Owners ',
      field: 'account_secondary_owner',
      colId: 'account_secondary_owner',
      dbKey: 'account_secondary_owner',
      minWidth: 200,
      initialShowColumn: true,
    },
    {
      headerName: 'ISIN ',
      field: 'account_ISIN',
      colId: 'account_ISIN',
      dbKey: 'account_ISIN',
      minWidth: 200,
      initialShowColumn: true,
    });

    this.getTransactionList();
  }

  getTransactionList() {
    this.tmService.getTransactionsOfAHit(this.data.hitId).subscribe(
        (response: ITMAlertHitTransaction[]) =>
            this.setAgGridOptions(
              map(
              response,
              transaction =>
                transaction && transaction.event_json && transaction.event_json.attributes ?
                  {
                    event_id: transaction.event_id,
                    event_time: transaction.event_time,
                    ...transaction.event_json.attributes
                  } : {}

            )));
  }

  setAgGridOptions(rowData: ITMAlertTrnAttributes[]) {
    this.gridOptions = {
      'resizable': true,
      'tableName': 'Hit transaction list',
      'columnDefs': this.columnDefs,
      'rowData': rowData,
      'rowStyle': { 'border-bottom': '#424242 1px solid' },
      'rowSelection': 'multiple',
      'floatingFilter': true,
      'animateRows': true,
      'sortable': true,
      'tabs': false,
      'isShoHideColumns': true,
      'multiSortKey': 'ctrl',
      'componentType': 'hit transaction list',
      'defaultGridName': 'Transaction View',
      'cellClass': 'ws-normal',
      'changeBackground': "#ef5350",
      "applyColumnDefOrder": true,
      'rowModelType': 'clientSide',
      'enableTableViews': true,
      'cacheBlockSize': 10,
      'paginationPageSize': 10,
      'pagination': true,
      'enableServerSideFilter': false,
      'enableServerSideSorting': false,
      'showBulkOperations': false,
      'filter': true,
      'enableCheckBoxes': false,
      'enableTopSection': true,
      'rowHeight': 43,
      'dateFilterProperties': {
        opensProperty: 'left',
        dropsPropertyType: 'up'
      }
    };
  }

}
