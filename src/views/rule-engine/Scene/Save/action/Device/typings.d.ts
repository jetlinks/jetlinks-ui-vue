import { ProductItem } from '@/views/device/Product/typings';
import { ActionsDeviceProps } from '../../../typings';

type DeviceModelType = {
    productId: string;
    source: string;
    selector: string;
    selectorValues: any;
    source: string;
    upperKey: string;
    deviceId: string;
    message: {
        properties?: any;
        messageType: string;
        inputs?: any[]
    }
}

type DeviceOptionType = {
    name?: string;
    productName?: string;
    propertiesValue?: string;
    propertiesName?: any;
    tagName?: string;
    relationName?: string;
    actionName?: string; 
}

