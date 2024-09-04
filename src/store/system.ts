import { defineStore } from "pinia";
import {getDetails_api, settingDetail, systemVersion} from "@/api/system/basis";
import {
  getTagsColor,
} from '@/api/system/calendar'
import {LocalStore} from "@jetlinks-web/utils";

interface LayoutType {
  siderWidth: number
  headerHeight: number
  collapsedWidth: number
  title: string
  logo: string
  layout: 'mix' | 'side' | 'top'
}

export const useSystemStore = defineStore('system', () => {
  const theme = ref<string>('light') // 主题色
  const ico = ref<string>('/favicon.ico') // 浏览器标签页logo
  const systemInfo = ref<Record<string, any>>({})
  const microApp = ref<Record<string, any>>({})
  const calendarTagColor = new Map()
  const showThreshold = ref(true)

  const layout = reactive<LayoutType>({
    siderWidth: 208,
    headerHeight: 48,
    collapsedWidth: 48,
    title: '物联网平台', // 浏览器标签页title和系统名称
    logo: '/images/login/logo.png',
    layout: 'mix'
  })

  /**
   * 切换主题色
   * @param type
   */
  const changeTheme = (type: string) => {
    theme.value = type
  }

  /**
   * 修改其它配置项
   * @param code
   * @param value
   */
  const changeLayout = (code: string, value: string | number) => {
    layout[code] = value
  }

  /**
   * 修改浏览器标签ico
   * @param url
   */
  const changeIco = (url: string) => {
    ico.value = url
    const icoDom: any = document.querySelector('link[rel="icon"]')!;
    icoDom.href = url
  }

  const changeTitle = (value: string) => {
    document.title = value
  }

  const setDocumentTitle = () => {
    const _data = systemInfo.value['front']
    if (_data) {
      const ico: any = document.querySelector('link[rel="icon"]');
      ico.href = _data.ico;
      document.title = _data.title || '';
    }
  }

  const handleFront = (_value: any) => {
    layout.title = _value.title
    layout.logo = _value.logo
    theme.value = _value.headerTheme
    changeIco(_value.ico)
    setDocumentTitle()
    changeTitle(_value.title)
  }

  const queryInfo = async () => {
    const _keys = ['front', 'amap', 'paths']
    const resp = await getDetails_api(_keys)
    if (resp.success) {
      _keys.forEach((key: string) => {
        const _value = resp.result.find((item: any) => item.scope === key)?.properties
        systemInfo.value[key] = _value ?? {}
        if (key === 'front') {
          handleFront(_value)
        }
      })
    }
  }

  const querySingleInfo = async (__keys: string) => {
    if (!__keys) return
    const resp = await settingDetail(__keys)
    if (resp.success) {
      const _value = resp.result
      systemInfo.value[__keys] = _value ?? {}
      if (__keys === 'front') {
        handleFront(_value)
      }
    }
  }

  const setMircoData = () => {
    if ((window as any).__MICRO_APP_ENVIRONMENT__) {
      microApp.value = (window as any).microApp.getData() // 获取主应用下发的数据
    }
  }

  const queryTagsColor = async() => {
    const answer:any = await getTagsColor();
    if (answer.success) {
      Object.keys(answer.result).forEach((i) => {
        calendarTagColor.set(i, answer.result[i]);
      });
    }
  }

  const queryVersion = async () => {
    const resp = await systemVersion()
    if (resp.success && resp.result) {
      const isCommunity = resp.result.edition === 'community'
      LocalStore.set('version_code', isCommunity)
    }
  }

  return {
    systemInfo,
    theme,
    ico,
    layout,
    calendarTagColor,
    showThreshold,
    changeTheme,
    changeLayout,
    changeIco,
    changeTitle,
    queryInfo,
    querySingleInfo,
    setMircoData,
    queryTagsColor,
    queryVersion
  }
})
