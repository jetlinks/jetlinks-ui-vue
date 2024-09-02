import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

/**基本信息表单 */
export interface formState  {
  title: string; // 系统名称
  headerTheme: string; // 主题色
  showRecordNumber: boolean; //是否显示备案号
  recordNumber: string; //备案号
  basePath: string; // 系统后台访问的URL
  logo: string; // 系统logo
  ico: string; // 浏览器页签
  background:string; //登录背景
}

/**
 * 图片上传表单
 */
export interface logoState  {
  logoValue: string;
  logoLoading: boolean;
  backLoading: boolean;
  iconLoading: boolean;
  inLogo: boolean;
  inIcon: boolean;
  inBackground: boolean;
  iconValue: string;
  backValue: string;
  backSize: number;
  logoSize: number;
  imageTypes:Array<string>;
  iconTypes: Array<string>,
  beforeLogoUpload:(file: UploadProps['beforeUpload']) => void
  handleChangeLogo:(info: UploadChangeParam ) => void
  beforeBackUpload:(file: UploadProps['beforeUpload']) => void
  changeBackUpload:(info: UploadChangeParam ) => void
  beforeIconUpload:(file: UploadProps['beforeUpload']) => void
  changeIconUpload:(info: UploadChangeParam ) => void
}
