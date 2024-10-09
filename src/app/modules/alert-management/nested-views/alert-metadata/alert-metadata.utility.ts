import { AlertMetaDataTypes } from "./alert-metadata.types";

export namespace AlertMetaDataUtility {


    export function parseMetaData(alertData: any) {
        let metaData = {};
        if (alertData.alert_metadata) {
            metaData = {
                alertId: alertData.alert_metadata.alert_id || 'N/A',
                created: alertData.alert_metadata.alert_time || 'N/A',
                alertType: alertData.alert_metadata.alert_type || 'N/A',
                tenant: alertData.alert_metadata.tenant_id|| 'N/A',
            }
            if(alertData.alert_relations){
                let data = getMetaDataInfo(alertData.alert_relations);
                return { ...metaData, ...data }
            }else {
                return {...metaData,...emptygetMetaDataInfo()}
            }
        } else {
            return {...emptyMetaDataObject(),...emptygetMetaDataInfo()}
        }
    }

    function getMetaDataInfo(alertRelations: Array<any>) {
        let caseRelatedMetaData = alertRelations.find(alert => alert.type_of_relationship === 'RELATED_CASE') || '';
        if (caseRelatedMetaData) {
            let caseRelatedEntity = {
                assignee: caseRelatedMetaData.related_entity_attributes.assignee ? caseRelatedMetaData.related_entity_attributes.assignee : 'N/A',
                priority: caseRelatedMetaData.related_entity_attributes.priority ? caseRelatedMetaData.related_entity_attributes.priority : 'N/A',
                status_reason: caseRelatedMetaData.related_entity_attributes.status_reason ? caseRelatedMetaData.related_entity_attributes.status_reason[0] : 'N/A',
                status: caseRelatedMetaData.related_entity_attributes.status ? caseRelatedMetaData.related_entity_attributes.status : 'N/A'
            }
            return {
                caseId: caseRelatedMetaData.related_entity_id,
                assignee: caseRelatedEntity.assignee,
                priority: caseRelatedEntity.priority,
                status_reason: caseRelatedEntity.status_reason,
                status: caseRelatedEntity.status,
                ...getPriorityExtraData(caseRelatedEntity.priority),
                ...getStatusExtraData(caseRelatedEntity.status),
                ...getStatusReasonExtraData(caseRelatedEntity.status_reason)
            }
        } else {
            return emptygetMetaDataInfo
        }
    }

    function emptyMetaDataObject() {
        return {
            alertId: 'N/A',
            created: 'N/A',
            alertType: 'N/A',
            tenant: 'N/A',
        }

    }

    function getPriorityExtraData(status){
        switch (status) {
            case AlertMetaDataTypes.Priority.High:
                return {
                    priorityIcon : 'warning',
                    priorityColour : '#FC5C66'
                }
                case AlertMetaDataTypes.Priority.Medium:
                    return {
                        priorityIcon : 'warning',
                        priorityColour : '#DD7EFF'
                    }
                    case AlertMetaDataTypes.Priority.Low:
                    return {
                        priorityIcon : 'warning',
                        priorityColour : '#00CA98'
                    }
            default:
               return {
                    priorityIcon : 'error',
                    priorityColour : '#FC5C66'
                }
        }
    }

    function getStatusExtraData(status){
        switch (status) {
            case 'New':
                return {
                    statusIcon : 'error',
                    statusColour : '#FF9B56'
                }
        
            default:
               return {
                statusIcon : 'warning',
                statusColour : '#00CA98'
                }
                break;
        }
    }

    function getStatusReasonExtraData(status){
        switch (status) {
            case 'New':
                return {
                    statusReasonIcon : 'play_circle_outline',
                    statusReasonColour : '#FFFFFF99'
                }
            default:
               return {
                statusReasonIcon : 'play_circle_outline',
                    statusReasonColour : '#FFFFFF99'
                }
                break;
        }
    }




    function emptygetMetaDataInfo (){
        return {
            caseId: 'N/A',
            assignee: 'N/A',
            priority: 'N/A',
            status_reason: 'N/A',
            status: 'N/A',
        }
    }
}