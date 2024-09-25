export interface ConfigurationType {
    port: string | undefined;
    host: string | undefined;
    username: string;
    password: string;
    endpoint: string,
    securityPolicy: string | undefined,
    securityMode: string | undefined,
    certId: string | undefined,
    authType: string | undefined,
    deviceId: string | undefined,
    deviceName: string | undefined,
    connect:boolean | undefined
    instanceNumber?:number
    overIp: {
        localBindAddress: string,
        port: number,
        subnetAddress: string,
        networkPrefixLength:number,
    }
}

export interface FormDataType {
    name: string;
    provider:  string | undefined,
    configuration: ConfigurationType;
    description?: string;
}
