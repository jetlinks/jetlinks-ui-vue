export interface Form2 {
    id: number;
    serverId: string | undefined;
    configuration: {
        parserType: undefined;
        port: undefined;
        host: string;
        publicPort: string;
        publicHost: string;
        remoteHost: string;
        remotePort: string;
        secure: boolean;
        username: string;
        password: string;
        topicPrefix: string;
        maxMessageSize: string;
        certId: string;
        privateKeyAlias: string;
        clientId: string;
        parserConfiguration: {
            delimited: string;
            lang: string;
            script: string;
            size: string;
            length: string;
            offset: string;
            little: string | boolean;
        };
    };
    description: string;
}
