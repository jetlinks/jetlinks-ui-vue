type BaseItem = {
    id: string;
    name: string;
};

type State = {
    value: string;
    text: string;
};

type SipConfig = {
    catalogEach: number;
    charset: string;
    clusterNodeId: string;
    domain: string;
    firmware: string;
    hostAndPort: string;
    keepaliveInterval: number;
    keepaliveTimeoutTimes: number;
    localAddress: string;
    localSipId: string;
    manufacturer: string;
    model: string;
    name: string;
    password: string;
    port: number;
    publicAddress: string;
    publicPort: number;
    sipId: string;
    stackName: string;
    transport: string;
    user: string;
};
export type CascadeItem = {
    mediaServerId: string;
    onlineStatus: State;
    proxyStream: boolean;
    sipConfigs: Partial<SipConfig>[];
    status: State;
    count?: number;
} & BaseItem;
