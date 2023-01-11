export type treeNodeTpye = {
    name: string;
    key: string;
    link?: string;
    apiList?: object[];
    children?: treeNodeTpye[];
};
export type methodType = {
    [key:string]: object
}
export type apiObjType = {
    url: string,
    method: methodType
}