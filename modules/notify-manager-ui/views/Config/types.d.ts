export interface IHeaders {
    _key?: string;
    id?: number;
    key: string;
    value: string;
}
export interface IConfiguration {
    // 钉钉
    appKey?: string;
    appSecret?: string;
    url?: string;
    // 微信
    corpId?: string;
    corpSecret?: string;
    // 邮件
    host?: string;
    port?: number;
    ssl?: boolean;
    sender?: string;
    username?: string;
    password?: string;
    // 语音
    regionId?: string;
    accessKeyId?: string;
    secret?: string;
    // 短信
    regionId?: string;
    accessKeyId?: string;
    secret?: string;
    // webhook
    // url?: string;
    headers?: IHeaders[];
}
export type ConfigFormData = {
    configuration: IConfiguration;
    // configuration: {
    //     // 钉钉
    //     appKey?: string;
    //     appSecret?: string;
    //     url?: string;
    //     // 微信
    //     corpId?: string;
    //     corpSecret?: string;
    //     // 邮件
    //     host?: string;
    //     port?: number;
    //     ssl?: boolean;
    //     sender?: string;
    //     username?: string;
    //     password?: string;
    //     // 语音
    //     regionId?: string;
    //     accessKeyId?: string;
    //     secret?: string;
    //     // 短信
    //     regionId?: string;
    //     accessKeyId?: string;
    //     secret?: string;
    //     // webhook
    //     // url?: string;
    //     headers?: IHeaders[];
    // };
    description: string;
    name: string;
    provider: string;
    type: string;
    id?: string;
    maxRetryTimes?: number;
    creatorId?: string;
    createTime?: number;
};
