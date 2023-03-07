// 推荐步骤每项
export interface recommendList {
    title: string;
    details: string;
    iconUrl: string;
    linkUrl: string;
    params?: object;
    auth: boolean;
    dialogTag?: 'accessMethod' | 'funcTest';
}
// 产品列表里的每项
export interface productItem {
    label: string;
    value: string
}
export interface deviceInfo {
    deviceId: string,
    deviceName: string,
    productName: string,
    createTime: string,
    status: boolean
}

export interface bootConfig {
    english: string,
    label: string,
    link: string,
    auth: boolean,
    image?:string,
    params?: object,
}