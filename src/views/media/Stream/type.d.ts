export interface Configuration {
    secret: string;
    apiHost: string;
    apiPort: number | string;
    rtpIp: string | string;
    rtpPort: number | string;
    rtspPort: number | string;
    rtmpPort: number | string;
    dynamicRtpPort: boolean;
    dynamicRtpPortRange?: array<any>;
    dynamicRtpPortRange0?: number | string | undefined;
    dynamicRtpPortRange1?: number | string | undefined;
    distinguish: boolean
}
export interface FormDataType {
    name: string;
    provider: string | undefined;
    configuration: Configuration;
    id?: string;
    otherConfiguration: any
}
