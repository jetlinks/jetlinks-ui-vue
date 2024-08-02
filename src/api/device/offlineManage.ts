import request from '@/utils/request';
import type { ISearchParams } from '@/global';
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

const handleReqParams = (params: ISearchParams) => {
    // 这里接口文档有问题，照着接口文档写查询会有问题
    params.terms.unshift({
        type: 'or',
        value: 'offline',
        termType: 'eq',
        column: 'state',
    });
    let res;
    if (params.offlineReasons) {
        const offlineReasons = params.offlineReasons;
        const isContains = params.isContains;
        Reflect.deleteProperty(params, 'offlineReasons');
        Reflect.deleteProperty(params, 'isContains');
        res = {
            queryParamEntity: {
                ...params,
            },
            offlineReasons,
            isContains,
        };
    } else {
        res = {
            queryParamEntity: {
                ...params,
            },
            offlineReasons: '',
            isContains: true,
        };
    }
    return res;
};

export const fetchOfflineDevice = (params: ISearchParams) => {
    return request.post<IOfflineDeviceRes>(
        '/vehicle/device/offline/_query',
        handleReqParams(params),
    );
};

export const checkDevice = (deviceId: string) =>
    request.get<boolean>(`/vehicle/device/offline/check?deviceId=${deviceId}`);

export const offlineDeviceExport = (format: string, params: ISearchParams) =>
    request.postStream(
        `/vehicle/device/offline/${format}`,
        handleReqParams(params),
    );
