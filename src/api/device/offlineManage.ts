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

export const fetchOfflineDevice = (params: ISearchParams) => {
    return request.post<IOfflineDeviceRes>(
        '/vehicle/device/offline/_query',
        params,
    );
};

export const checkDevice = (deviceId: string) =>
    request.get<boolean>(`/vehicle/device/offline/check?deviceId=${deviceId}`);

/**
 * offlineDeviceExport 离线设备导出
 * @param format 导出文件的格式
 * @param params
 */
export const offlineDeviceExport = (format: string, params: ISearchParams) =>
    request.postStream(`/vehicle/device/offline/${format}`, params);
