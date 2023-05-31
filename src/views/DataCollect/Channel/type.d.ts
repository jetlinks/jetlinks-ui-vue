export interface ConfigurationType {
    port: string | undefined;
    host: string | undefined;;
    username: string;
    password: string;
    endpoint: string,
    securityPolicy: string | undefined,
    securityMode: string | undefined,
    certId: string | undefined,
    authType: string | undefined,

}

export interface FormDataType {
    name: string;
    provider:  string | undefined,
    configuration: ConfigurationType;
    description?: string;
}
