
export interface TypeObjType = {
    text: string;
    value: string;
};
export type FormDataType = {
    description: string;
    name: string;
    type: string | TypeObjType;
    configs: {
        cert: string;
        key: string;
    };
    id?: string;
    format?: string;
    mode?: object;
    creatorId?: string;
    createTime?: number;
};
