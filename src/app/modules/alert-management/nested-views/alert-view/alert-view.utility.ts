export namespace AlertViewUtility {

    export function filterWatchlistData(data: any, selectedHit: any) {
        let selectedData = {}
        data.hits.forEach(hitData => {
            if (hitData.hit_producer_category == 'screening' || hitData.hit_producer_category == 'WatchlistScreeningAlert' && selectedHit.hit_producer_category == 'screening' || selectedHit.hit_producer_category == 'WatchlistScreeningAlert' && hitData.hits_metadata.length > 0) {
                selectedData = selectedWatchlistData(data, hitData, selectedHit)
            } else if (hitData.hit_producer_category === 'BST_ADVERSE_MEDIA' && selectedHit.hit_producer_category === 'BST_ADVERSE_MEDIA' && hitData.hits_metadata.length > 0) {
                selectedData = selectedWatchlistData(data, hitData, selectedHit)
            }
        })
        return selectedData
    }

    export function filterGeneralAttributesData(data: any) {
        let generalData = []
        data.hits.forEach(hitData => {
            if (hitData.hit_producer_category == 'screening' || hitData.hit_producer_category == 'WatchlistScreeningAlert' && hitData.hits_general_attributes.length > 0) {
                generalData = hitData.hits_general_attributes
            }
        })
        return generalData
    }

    export function setAlertDetails(data: any) {
        let extraData = {}
        extraData['entity_type'] = data.alert_entity_information.entity_type
        return extraData
    }

    export function filterCustomerInformationData(data: any) {
        let customerData = {};
        if (
            data != undefined &&
            data.alert_entity_information != undefined &&
            data.alert_entity_information.entity_attributes != undefined &&
            data.alert_entity_information.entity_attributes.customer_information
        ) {
            customerData = data.alert_entity_information.entity_attributes.customer_information;
        }
        return customerData;
    }

    function selectedWatchlistData(data, hitData, selectedHit) {
        let watchlistData = {}        
        if (selectedHit && Object.keys(selectedHit).length == 0) {
            return watchlistData
        }

        if (selectedHit && Object.keys(selectedHit).length > 0) {
            watchlistData = hitData.hits_metadata.find(res => res.hit_id === selectedHit.hit_id)
        } else {
            if (data.alert_extra_data.selectedHitRecordId) {
                watchlistData = hitData.hits_metadata.find(res => res.hit_id === data.alert_extra_data.selectedHitRecordId)
                watchlistData = watchlistData ? watchlistData : hitData.hits_metadata[0]
            }
        }
        return watchlistData
    }
}