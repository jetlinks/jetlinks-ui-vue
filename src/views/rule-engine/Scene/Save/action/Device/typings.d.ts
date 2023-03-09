import { ProductItem } from '@/views/device/Product/typings';
import { ActionsDeviceProps } from '../../../typings';

type DeviceModelType = {
    // steps: {
    //     key: string;
    //     title: string;
    //     content: React.ReactNode;
    // }[];
    // current: number;
    productId: string;
    deviceId: string;
    productDetail: ProductItem | any;
    device: Partial<ActionsDeviceProps>;
    deviceDetail: any;
    options: any;
    selector: string;
    selectorValues: any;
    upperKey: string;
    source: string;
    relationName: string;
    message: any;
    propertiesName: string;
    propertiesValue: string | any;
    columns: string[];
    actionName: string;
    tagList: any[];
}