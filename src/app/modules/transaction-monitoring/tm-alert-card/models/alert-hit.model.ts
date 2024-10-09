export interface ITMAlertHit {
    id: string;
    hitId: string;
    name: string;
    description: string;
    alertId: number;
    score: number;
    ruleName: string;
    ruleCategory: string;
    rule: string;
    hitCreatedTime: string;
}