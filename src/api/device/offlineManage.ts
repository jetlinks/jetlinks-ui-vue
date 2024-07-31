import request from '@/utils/request';

interface IParams {
    terms?: {
        column?: string;
        value?: Record<string, any>;
        type?: string;
        termType?: string;
        options?: any[];
        terms?: {
            column?: string;
            value: Record<string, any>;
            type: string;
            termType: string;
            options: any[];
            terms: Record<string, any>[];
        }[];
    }[];
    includes?: any[];
    excludes?: any[];
    paging?: boolean;
    firstPageIndex?: number;
    pageIndex?: number;
    pageSize?: number;
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
}
interface IOfflineDeviceRes {
    pageIndex: number;
    pageSize: number;
    total: number;
    data: {
        id: string;
        photoUrl: string;
        name: string;
        deviceType: string;
        describe: string;
        productId: string;
        productName: string;
        configuration: Record<string, any>;
        deriveMetadata: string;
        parentId: string;
        features: any[];
        offlineReasons: string;
    }[];
}

export const fetchOfflineDevice = (params: IParams) =>
    request.post<IOfflineDeviceRes>('/vehicle/device/offline/_query', params);

export const checkDevice = (deviceId: string) =>
    request.get<boolean>(`/vehicle/device/offline/check?deviceId=${deviceId}`);

export const offlineDeviceExport = (format: string, params: IParams) =>
    request.postStream(`/vehicle/device/offline/${format}`, params);
