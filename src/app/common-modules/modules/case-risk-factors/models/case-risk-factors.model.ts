interface IRiskSummary {
    riskAggregationType: string;
    riskScore: string;
    riskLevel: string;
    riskFlags: string;
}

interface IRiskFactor {
    riskID: string;
    riskName: string;
    riskSource: string;
    riskType: string;
    riskScore: string;
    riskLevel: string;
    riskFlag: string;
    riskMinThreshold: string;
    riskMaxThreshold: string;
}

interface IRiskCategory {
    CategoryName: string;
    CategoryScore: string;
    CategoryLevel: string;
    CategoryAggregationType: string;
    RiskFactors: IRiskFactor[];
}

interface IRiskFactorData {
    RiskSummary: IRiskSummary;
    RiskCategories: IRiskCategory[];
}

export { IRiskFactorData, IRiskSummary, IRiskCategory, IRiskFactor };