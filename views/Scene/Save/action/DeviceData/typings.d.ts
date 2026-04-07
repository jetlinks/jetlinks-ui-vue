export type DeviceModelDataType = {
    productId: string;
    selector: any | {
        selector: string;
        selectorValues: any[];
        source: string;
        upperKey: string;
    };
    deviceId: string;
    message: {
        properties?: any;
        messageType: string;
        inputs?: any[];
        functionId?: string;
    }
}
export type DeviceModelType = {
    productId: string;
    source: string;
    selector: string
    selectorValues: any;
    upperKey: string;
    deviceId: string;
    message: {
        properties?: any;
        messageType: string;
        inputs?: any[];
        functionId?: string;
    }
}

export type DeviceOptionType = {
    name?: string;
    productName?: string;
    propertiesValue?: string;
    propertiesName?: any;
    tagName?: string;
    relationName?: string;
    actionName?: string;
}

