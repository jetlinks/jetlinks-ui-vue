
export interface Configuration = {
    secret: string,
    apiHost: string,
    apiPort: number,
    rtpIp: string,
    rtpPort: number,
    dynamicRtpPort: boolean,
    dynamicRtpPortRange?: array,
    dynamicRtpPortRange0?: number,
    dynamicRtpPortRange1?: number,
};
export type FormDataType = {
    name: string;
    provider: undefined;
    configuration: Configuration;
    id?: string;
};

