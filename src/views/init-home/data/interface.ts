import type { Rule } from 'ant-design-vue/es/form';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
/** 初始化数据提交表单 */
export interface modalState  {
  host: string; // 本地地址
  port?: string; // 本地端口
  publicHost?: string; // 公网地址
  publicPort?: number | null; // 公网端口
  
}

/**基本信息表单 */
export interface formState  {
  title: string; // 系统名称
  headerTheme: string; // 主题色
  apikey: string; // 高德 API key
  isIOT: string; //是否为联邦架构
  factoryId: string;//工厂id
  factoryKey:string; //工厂Topic
  factoryType:string; //工厂类型
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
