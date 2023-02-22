export type FormDataType = {
    description: string;
    name: string;
    productId: string | undefined;
    version: undefined;
    versionOrder: undefined;
    signMethod: string | undefined;
    sign: string;
    url: string;
    size: number;
    properties: Array<Properties>;
    id?: string;
    format?: string;
    mode?: object;
    creatorId?: string;
    createTime?: number;
};

export interface Properties {
    id: string;
    value: any;
    keyid: number;
}
