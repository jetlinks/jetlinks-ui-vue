import type { Rule } from 'ant-design-vue/es/form';

/**基本信息表单 */
export interface formValueType {
    title: string; // 系统名称
    headerTheme: string; // 主题色
    apiKey: string; // 高德 API key
    'base-path': string; // 系统后台访问的URL
    logo:string,
    ico:string,
    backgroud:string
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
