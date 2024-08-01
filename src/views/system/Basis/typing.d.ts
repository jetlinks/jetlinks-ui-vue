import type { Rule } from 'ant-design-vue/es/form';

/**基本信息表单 */
export interface formValueType {
    title: string | undefined; // 系统名称
    headerTheme: string | undefined; // 主题色
    apiKey: string | undefined; // 高德 API key
    secretKey: string | undefined; // 高德 API 密钥;
    webKey: string | undefined; //高德web API key,
    showRecordNumber: boolean | undefined; //是否显示备案号，
    recordNumber: string | undefined; //备案号
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
    secretKey: string;
    webKey: string
}

export type MediaType = {
    "fix-ptz": string;
    "fix-record": string;
    "gb-ptz": string;
    "gb-record":string;
    "onvif-ptz":string;
    "onvif-record":string;
    "plugin-ptz":string;
    "plugin-record":string;
}

export type ConfigInfoType = {
    paths: PathType;
    amap: AMapKey;
    front: formValueType;
    media: MediaType
}