export interface ConfigurationType {
    parserType: string | undefined;
    port: string | undefined;
    host: string | undefined;
    publicPort: string;
    publicHost: string;
    remoteHost: string;
    remotePort: string;
    secure: boolean;
    username: string;
    password: string;
    topicPrefix: string;
    maxMessageSize: string | number;
    certId: string | undefined;
    privateKeyAlias: string;
    clientId: string;
    parserConfiguration: {
        delimited: string;
        lang: string;
        script: string;
        size: string;
        length: string;
        offset: string;
        little: string | boolean | undefined;
    };
}

export interface FormDataType {
    name: string;
    type: string;
    shareCluster: boolean;
    description: string;
}

export interface TagsFilterType {
    column: string;
    termType: string;
    value: string;
    terms: TagsFilterType[]
    type: string;
}
export interface FormData2Type {
    id?: number | string;
    serverId?: string | undefined;
    index: number;
    tagsFilter?: TagsFilterType[];
    configuration: ConfigurationType;
}
