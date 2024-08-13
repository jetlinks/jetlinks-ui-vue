import type { Rule } from 'ant-design-vue/es/form';

/**基本信息表单 */
export interface formValueType {
    title: string | undefined; // 系统名称
    headerTheme: string | undefined; // 主题色
    mapType: string | undefined; //地图选中
    apiKey: string | undefined; // 高德 API key
    'base-path': string | undefined; // 系统后台访问的URL
    reportPath: string | undefined;
    logo: string | undefined;
    ico: string | undefined;
    background: string | undefined;
}

export interface formType {
    formValue: formValueType;
    rulesFrom: Record<string, Rule[]>;
    logoLoading: boolean;
    backLoading: boolean;
    iconLoading: boolean;
    saveLoading: boolean;
    clickSave?: Function;
    getDetails: Function;
}

/**
 * 图片上传表单
 */
export interface uploaderType {
    imageTypes: Array<string>;
    iconTypes: Array<string>;
    beforeLogoUpload: (file: UploadProps['beforeUpload']) => void;
    handleChangeLogo: (info: UploadChangeParam) => void;
    beforeBackUpload?: (file: UploadProps['beforeUpload']) => void;
    changeBackUpload: (info: UploadChangeParam) => void;
    beforeIconUpload: (file: UploadProps['beforeUpload']) => void;
    changeIconUpload: (info: UploadChangeParam) => void;
}

export type PathType = {
    'base-path': string;
    'sso-bind': string;
    'sso-redirect': string;
    'sso-token-set': string;
};

export type AMapKey = {
    apiKey: string;
};

export type ConfigInfoType = {
    paths: PathType;
    amap: AMapKey;
    front: formValueType;
};
