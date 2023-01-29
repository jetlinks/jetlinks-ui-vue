export interface IHeaders {
    id?: number;
    key: string;
    value: string;
}

interface IAttachments {
    location: string;
    name: string;
    id?: string;
}
interface IVariableDefinitions {
    id: string;
    name: string;
    type: string;
    format: string;
    value?: string;
}

interface IMarkDown {
    text: string;
    title: string;
}
interface ILink {
    title: string;
    picUrl: string;
    messageUrl: string;
    text: string;
}

export type TemplateFormData = {
    template: {
        // 钉钉消息
        agentId?: string;
        message?: string;
        // 钉钉机器人
        messageType?: string;
        markdown?: IMarkDown;
        link?: ILink;
        // 微信
        // agentId?: string;
        // message?: string;
        toParty?: string;
        toUser?: string;
        toTag?: string;
        // 邮件
        subject?: string;
        sendTo?: string[];
        attachments?: IAttachments[];
        // message?: string;
        text?: string;
        // 语音
        templateType?: string;
        templateCode?: string;
        ttsCode?: string;
        // message?: string;
        playTimes?: number;
        calledShowNumbers?: string;
        calledNumber?: string;
        // 短信
        code?: string;
        // message?: string;
        phoneNumber?: string;
        signName?: string;
        // webhook
        contextAsBody?: boolean;
        body?: string;
    };
    name: string;
    type: string;
    provider: string;
    description: string;
    variableDefinitions: IVariableDefinitions[];
    id?: string;
    creatorId?: string;
    createTime?: number;
    configId?: string;
};

// 绑定配置类型
export type config = {
    host: string;
    password: string;
    port: number;
    sender: string;
    ssl: boolean;
    username: string;
}
export type BindConfig = {
    configuration: config;
    createTime: number
    creatorId: string;
    id: string;
    maxRetryTimes: number;
    name: string;
    provider: string;
    type: string
}