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