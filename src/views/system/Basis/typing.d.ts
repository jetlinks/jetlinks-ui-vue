import type { Rule } from 'ant-design-vue/es/form';

/**基本信息表单 */
export interface formValueType {
    title: string | undefined; // 系统名称
    headerTheme: string | undefined; // 主题色
    apiKey: string | undefined; // 高德 API key
    factoryKey:string | undefined; //工厂id配置
    factoryType: string | undefined; //工厂类型
    'base-path': string | undefined; // 系统后台访问的URL
    logo: string | undefined;
    ico: string | undefined;
    backgroud: string | undefined;
}

export interface formType {
    formValue: formValueType,
    rulesFrom: Record<string, Rule[]>
    logoLoading: boolean,
    backLoading: boolean,
    iconLoading: boolean,
    saveLoading: boolean,
    clickSave?: Function,
    getDetails: Function
}

/**
* 图片上传表单
*/
export interface uploaderType {
    imageTypes: Array<string>;
    iconTypes: Array<string>,
    beforeLogoUpload: (file: UploadProps['beforeUpload']) => void
    handleChangeLogo: (info: UploadChangeParam) => void
    beforeBackUpload?: (file: UploadProps['beforeUpload']) => void
    changeBackUpload: (info: UploadChangeParam) => void
    beforeIconUpload: (file: UploadProps['beforeUpload']) => void
    changeIconUpload: (info: UploadChangeParam) => void
}

export type PathType = {
    'base-path': string;
    'sso-bind': string;
    'sso-redirect': string;
    'sso-token-set': string;
}

export type AMapKey = {
    apiKey: string;
}

export type ConfigInfoType = {
    paths: PathType;
    amap: AMapKey;
    front: formValueType;
}