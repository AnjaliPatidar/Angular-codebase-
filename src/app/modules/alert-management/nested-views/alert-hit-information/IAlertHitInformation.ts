export interface RequestObject {
  alertId: string | number;
  identifiedEntityId: string | number;
  statuse: {
    code: string | number;
  };
}

export enum EntityName {
  Alert = "Alert",
}

export enum Status {
  OK = 'OK'
}
