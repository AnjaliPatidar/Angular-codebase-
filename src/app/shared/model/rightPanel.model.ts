import {entityDetails} from './entityDetails.model'
export interface RightPanelState {
    loaded: boolean;
    entityDetails : entityDetails[];   
   }

export interface RightPanelTableClickModel{
    queue_name:string,
    color:any,
    date_created:string,
    statue:string,
    alerts_assigned:any
}