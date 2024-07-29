export type diagnoseType =
    | 'network'
    | 'gateway'
    | 'product'
    | 'device'
    | 'product-auth'
    | 'device-auth'
    | 'parent-device'
    | 'ctwing'
    | 'onenet';
export type diagnoseStatusType = 'loading' | 'pass' | 'fail' | 'unknown';

export interface IDiagnoseItem {
    diagnoseType: diagnoseType;
    agreement?: string;
    title: string;
    desc: string;
    additional: string[];
    status: diagnoseStatusType;
    statusDesc?: string;
}

export type TypeProps =
    | 'network'
    | 'child-device'
    | 'media'
    | 'cloud'
    | 'channel';
