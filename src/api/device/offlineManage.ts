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

const handleReqParams = (
    params: ISearchParams,
    offlineReasons: string,
    isContains: boolean,
) => {
    // 这里接口文档有问题，照着接口文档写查询会有问题
    params.terms.unshift({
        type: 'or',
        value: 'offline',
        termType: 'eq',
        column: 'state',
    });
    return {
        queryParamEntity: {
            ...params,
        },
        offlineReasons,
        isContains,
    };
};

export const fetchOfflineDevice = (
    params: ISearchParams,
    offlineReasons: string,
    isContains: boolean,
) => {
    return request.post<IOfflineDeviceRes>(
        '/vehicle/device/offline/_query',
        handleReqParams(params, offlineReasons, isContains),
    );
};

export const checkDevice = (deviceId: string) =>
    request.get<boolean>(`/vehicle/device/offline/check?deviceId=${deviceId}`);

/**
 * offlineDeviceExport 离线设备导出
 * @param format 导出文件的格式
 * @param params
 * @param offlineReasons
 * @param isContains 是否包含子设备
 */
export const offlineDeviceExport = (
    format: string,
    params: ISearchParams,
    offlineReasons: string,
    isContains: boolean,
) =>
    request.postStream(
        `/vehicle/device/offline/${format}`,
        handleReqParams(params, offlineReasons, isContains),
    );
