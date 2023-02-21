export type treeNodeTpye = {
    name: string;
    key: string;
    schemas?:object;
    link?: string;
    apiList?: object[];
    children?: treeNodeTpye[];

};
export type methodType = {
    [key: string]: object
}
export type apiObjType = {
    url: string,
    method: methodType
}

export type apiDetailsType = {
    url: string;
    method: string;
    summary: string;
    parameters: any[];
    requestBody?: any;
    responses:object;
}