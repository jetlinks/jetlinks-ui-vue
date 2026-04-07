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
    description?:string;
}
/**
 * api: api配置
 * appManger： 应用管理-赋权
 * home：应用管理-查看菜单，第三方首页
 */
export type modeType = 'api'| 'appManger' | 'home'

export type schemaObjType = {
    paramsName: string;
    paramsType: string;
    id: string;
    type?: string;
    schema?: string;

    required?: boolean
    desc?: string;
    children?: schemaObjType[];
};