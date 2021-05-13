import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '首页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '统计分析',
  'menu.dashboard.monitor': '监控页'
}

export default {
  ...components,
  ...locale
}
