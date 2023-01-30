import type { ExtractPropTypes, FunctionalComponent } from 'vue'
import { defineComponent, PropType } from 'vue'
import { defaultRenderLogo, siderMenuProps } from 'components/Layout/components/SiderMenu/SiderMenu'
import BaseMenu from '../SiderMenu/BaseMenu'
import { useRouteContext } from 'components/Layout/RouteContext'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer';
import { defaultSettingProps } from 'components/Layout/defaultSetting'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { CustomRender, MenuDataItem, ProProps, RightContentRender, WithFalse } from 'components/Layout/typings'
import './index.less'
import { RouteRecordRaw } from 'vue-router'
import { clearMenuItem } from 'components/Layout/utils'

export const headerProps = {
  ...defaultSettingProps,
  collapsed: PropTypes.looseBool,
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  logo: siderMenuProps.logo,
  logoStyle: siderMenuProps.logoStyle,
  menuRender: {
    type: [Object, Function] as PropType<
      WithFalse<(props: ProProps, defaultDom: CustomRender) => CustomRender>
      >,
    default: () => undefined,
  },
  menuItemRender: siderMenuProps.menuItemRender,
  subMenuItemRender: siderMenuProps.subMenuItemRender,
  rightContentRender: {
    type: [Object, Function] as PropType<RightContentRender>,
    default: () => undefined,
  },
  siderWidth: PropTypes.number.def(208),
  // events
  onMenuHeaderClick: PropTypes.func,
  onCollapse: siderMenuProps.onCollapse,
  onOpenKeys: siderMenuProps.onOpenKeys,
  onSelect: siderMenuProps.onSelect,
}

export type HeaderProps = ExtractPropTypes<typeof headerProps>;

export default defineComponent({
  name: 'Header',
  emits: [
    'menuHeaderClick', 'collapse', 'openKeys', 'select'
  ],
  inheritAttrs: false,
  props: headerProps,
  setup(props, { slots, emit}) {

    const {
      onSelect,
      onMenuHeaderClick,
      onOpenKeys,
      logo,
      logoStyle,
      menuData,
      navTheme,
      contentWidth,
      title,
      rightContentRender
    } = props;

    const rightSize = ref<number | string>('auto')

    const context = useRouteContext();

    const noChildrenMenuData = (menuData || []).map((item) => ({
      ...item,
      children: undefined,
    })) as RouteRecordRaw[];

    const clearMenuData = clearMenuItem(noChildrenMenuData);

    return () => (
      <>
        <div
          class={`header-content ${navTheme}`}
        >
          <div class={`header-main ${contentWidth === 'Fixed' ? 'wide' : ''}`}>
            <div class={'header-main-left'} onClick={onMenuHeaderClick}>
              <div class={'header-logo'}>
                <a>
                  {defaultRenderLogo(logo, logoStyle)}
                  <h1 title={title}>{ title }</h1>
                </a>
              </div>
            </div>
            <div style={{ flex: 1 }} class={'header-menu'}>
              <BaseMenu
                theme={props.navTheme === 'realDark' ? 'dark' : props.navTheme}
                menuData={clearMenuData}
                mode={'horizontal'}
                menuItemRender={props.menuItemRender}
                subMenuItemRender={props.subMenuItemRender}
                openKeys={context.openKeys}
                selectedKeys={context.selectedKeys}
                {...{
                  'onUpdate:openKeys': ($event: string[]) => onOpenKeys && onOpenKeys($event),
                  'onUpdate:selectedKeys': ($event: string[]) => onSelect && onSelect($event),
                }}
              />
            </div>
            <div class={'header-right'} style={{ minWidth: rightSize.value }}>
              <div>
                <ResizeObserver
                  onResize={({ width }: { width: number}) => {
                    rightSize.value = width
                  }}
                >
                  {
                    rightContentRender && typeof rightContentRender === 'function' ? (
                      <div>{rightContentRender({...props})}</div>
                    ) : rightContentRender
                  }
                </ResizeObserver>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
})