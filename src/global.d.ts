declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.js';
declare module '*.ts';
declare module 'jetlinks-ui-components';
declare module 'vue3-json-viewer';
declare module 'event-source-polyfill';

export interface ITermItem {
    column: string;
    termType: string;
    type: string;
    value: string | number | boolean;
    options?: any[];
}

export interface ISearchParams {
    terms: {
        column?: string;
        value?: any;
        type?: string;
        termType?: string;
        options?: any[];
        terms?: ITermItem[];
    }[];
    includes?: any[];
    excludes?: any[];
    paging?: boolean;
    firstPageIndex?: number;
    pageIndex: number;
    pageSize: number;
    sorts?: {
        name: string;
        order: string;
        value: Record<string, any>;
    }[];
    context?: Record<string, any>;
    where?: string;
    orderBy?: string;
    total?: number;
    filter?: string;
    parallelPager?: boolean;
    [key: string]: any;
}
