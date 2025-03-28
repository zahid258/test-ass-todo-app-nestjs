export interface AnalyticsDashboard {
    usersByCountry: Array<CountryData>;
    usersByDevices: Array<DevicesData>;
    visitors: GeneralData;
    sessions: GeneralData;
    averageDurationPersession: GeneralData;
    bounceRate: GeneralData;
    engagedSessions: GeneralData;
    pagesViewedPerSession: GeneralData;
    pageViews: GeneralData;
    oldVsNewUsers: OldVsNew;
}

export interface CountryData {
    countryName: string;
    usersDetails: {total: number, new: number, active: number};
}

export interface DevicesData {
    deviceName: string; 
    userCount: number
}

export interface GeneralData {
    total: number; 
    diffPercent: number;
}

export interface OldVsNew {
    repeating: number; 
    new: number;
}

export interface AnalyticsResponse {
    dimensionHeaders?: DimensionHeader[];
    rowCount?: number | null;
    kind?: string | null;
    rows?: Row[];
    totals?: Row[];
    metricHeaders?: MetricHeader[];
}

export interface DimensionHeader {
    name?: string | null;
}

export interface Row {
    dimensionValues?: DimensionValue[];
    metricValues?: MetricValue[];
}

export interface DimensionValue {
    value?: string | null;
}

export interface MetricValue {
    value?: string | null;
}

export interface MetricHeader {
    name?: string | null;
    type?: string | null;
}