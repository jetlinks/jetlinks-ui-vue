/** 初始化数据提交表单 */
export interface modalState  {
  host: string; // 本地地址
  port: string; // 本地端口
  publicHost: string; // 公网地址
  publicPort: number | null; // 公网端口
  rules: Record<string, Rule[]>;
}

/**基本信息表单 */
export interface formState  {
  title: string; // 系统名称
  headerTheme: string; // 主题色
  apikey: string; // 高德 API key
  basePath: string; // 系统后台访问的URL
  logo: string; // 系统logo
  icon: string; // 浏览器页签
  rulesFrom: Record<string, Rule[]>;
}

/**
 * logo上传表当
 */
export interface logoState  {
  logoValue: string;
  logoLoading: boolean;
  inLogo: boolean;
  inIcon: boolean;
  inBackground: boolean;
  iconValue: string;
  backValue: string;
  handleChangeLogo:(url: string) => void
}