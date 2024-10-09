export interface ITMAlertTrnAttributes {
    event_id?:string;
    event_time?:any;
    transaction_segment?:any;
    transaction_debit_credit_indicator?:any;
    transaction_customer_account_number?:any;
    transaction_counterparty_account_number?:any;
    transaction_counterparty_account_sort_code?:any;
    origination_transaction_amount?:any;
    destination_transaction_amount?:any;
    transaction_counterparty_name?:any;
    transaction_counterparty_country?:any;
    transaction_from_currency?:any;
    transaction_to_currency?:any;
    transfer_method?:any;
    transaction_channel?:any;
    transaction_country?:any;
    transaction_IP_address?:any;
    transaction_comments?:any;
    transaction_first?:any;
    transaction_amount?: number;
    transaction_type_code?: string;
    transaction_status_code?: string;
    product_business_unit?: string;
    product_number?: string;
    product_category?: string;
    product_type?: string;
    product_sub_type?: string;
    organization_identifier?: string;
    organization_business_unit?: string;
    organization_name?: string;
    organization_domiciled_in?: string;
    organization_business_code?: any;
    organization_postal_country?: any;
    organization_country?: string;
    organization_registered_country?: string;
    person_Identifier?: string;
    person_business_unit?: string;
    person_given_name?: string;
    person_family_name?: string;
    person_nationality?: string;
    person_shipping_country?: string;
    person_delivery_method_country?: string;
    person_home_country?: string;
    person_office_country?: string;
    person_birth_date?: any;
    person_alert_type?: any;
    person_expected_KYC_amount?: any;
    account_business_unit?: string;
    account_Identifier?: string;
    account_currency?: string;
    account_opening_date?: any;
    account_closing_date?: any;
    account_live_date?: any;
    account_type?: string;
    account_balance?: any;
    account_party_type?: any;
    account_relationship?: any;
    account_status?: string;
    account_minor_flag?: string;
    account_sub_account_flag?: string;
    account_parent_flag?: string;
    account_other_identifiers?: string;
    account_primary_owner?: any;
    account_secondary_owner?: any;
    account_ISIN?: any;
    hit_id?: string;
    tenant_id?: string
    app_id?: string;
}

export interface ITMAlertHitTnEvent {
    event_name: string;
    event_id: string;
    event_base: string;
    event_time: string;
    extra_data: any;
    attributes: ITMAlertTrnAttributes;
}

export interface ITMAlertHitTransaction {
    app_id: string;
    event_id: string;
    event_json: ITMAlertHitTnEvent;
    event_time: string;
    hit_id: string;
    tenant_id: string
}