type BaseItem = {
    id: string;
    name: string;
};
type State = {
    value: string;
    text: string;
};

export type DeviceItem = {
    photoUrl?: string;
    channelNumber: number;
    createTime: number;
    firmware: string;
    gatewayId: string;
    host: string;
    manufacturer: string;
    model: string;
    port: number;
    provider: string;
    state: State;
    streamMode: string;
    transport: string;
} & BaseItem;

export type ProductType = {
    accessId: string;
    accessName: string;
    accessProvider: string;
    createTime: number;
    creatorId: string;
    deviceType: {
        text: string;
        value: string;
    };
    id: string;
    messageProtocol: string;
    metadata: string;
    modifierId: string;
    modifyTime: number;
    name: string;
    protocolName: string;
    state: number;
    transportProtocol: string;
}


type addressesType = {
    address: string;
    bad: boolean;
    disabled: boolean;
    health: number;
    ok: boolean;
}
export type gatewayType = {
    channel: string;
    channelId: string;
    channelInfo: {
        id: string;
        name: string;
        addresses: addressesType[];
    };
    id: string;
    name: string;
    protocol: string;
    protocolDetail: {
        id: string;
        name: string;
        description?: string;
    };
    provider: string;
    state: {
        text: string;
        value: string;
    };
    transport: string;
    transportDetail: {
        id: string;
        name: string;
        metadata: string;
        features: string[];
        routes: string[];
    };
    description?: string;
}