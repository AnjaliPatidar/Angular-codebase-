export interface ITMHitRuleCriteria {
    name: string;
    value: string;
}

export interface ITMHitRule {
    name: string;
    artifact_id: string;
    description: string;
    category: string;
    group_id: string;
    score: number;
    focal_point: string;
    scope: string;
    criteria: ITMHitRuleCriteria[];
    version: string;
}