import type { PropType } from 'vue'
import config from '../../../config/config'

export interface PureSettings {
  title: string
  /**
   * theme for nav menu
   */
  navTheme: 'dark' | 'light' | 'realDark' | undefined;
  /**
   * nav menu position: `side` or `top`
   */
  headerHeight?: number;
  /**
   * customize header height
   */
  layout: 'side' | 'top' | 'mix';
  /**
   * layout of content: `Fluid` or `Fixed`, only works when layout is top
   */
  contentWidth: 'Fluid' | 'Fixed';
  menu: { locale?: boolean; defaultOpenAll?: boolean };
  splitMenus?: boolean;
}

export const defaultSettings = {
  navTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  menu: {},
  headerHeight: 48,
  iconfontUrl: '',
  title: config.title
};

export const defaultSettingProps = {
  navTheme: {
    type: String as PropType<PureSettings['navTheme']>,
    default: defaultSettings.navTheme,
  },
  title: {
    type: String as PropType<PureSettings['title']>,
    default: () => defaultSettings.title,
  },
  layout: {
    type: String as PropType<PureSettings['layout']>,
    default: defaultSettings.layout,
  },
  contentWidth: {
    type: String as PropType<PureSettings['contentWidth']>,
    default: defaultSettings.contentWidth,
  },
  menu: {
    type: Object as PropType<PureSettings['menu']>,
    default: () => {
      return {
        locale: true,
      };
    },
  },
  headerHeight: {
    type: Number as PropType<PureSettings['headerHeight']>,
    default: defaultSettings.headerHeight,
  },
}

