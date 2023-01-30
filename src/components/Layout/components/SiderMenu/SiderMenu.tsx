import { Layout, Menu } from 'ant-design-vue';
import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType } from 'vue'
import type {
  LogoRender,
  MenuHeaderRender,
  MenuExtraRender,
  MenuContentRender,
  CollapsedButtonRender,
  WithFalse,
  CustomRender
} from '../../typings'
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { baseMenuProps } from 'components/Layout/components/SiderMenu/BaseMenu'
import AIcon from '@/components/AIcon'
import { useRouteContext } from 'components/Layout/RouteContext'
import BaseMenu from './BaseMenu'
import './SiderMenu.less'
import { computed } from 'vue'
import { omit } from 'lodash-es'

const { Sider } = Layout

export const defaultRenderLogo = (logo?: CustomRender, logoStyle?: CSSProperties): CustomRender => {
  if (!logo) {
    return null;
  }
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" style={logoStyle} />;
  }
  if (typeof logo === 'function') {
    // @ts-ignore
    return logo();
  }
  return logo;
};

export const siderMenuProps = {
  ...baseMenuProps,
  logo: {
    type: [Object, String, Function] as PropType<LogoRender>,
    default: () => '',
  },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined,
  },
  siderWidth: PropTypes.number.def(208),
  headerHeight: PropTypes.number.def(48),
  collapsedWidth: PropTypes.number.def(48),
  menuHeaderRender: {
    type: [Function, Object, Boolean] as PropType<MenuHeaderRender>,
    default: () => undefined,
  },
  menuContentRender: {
    type: [Function, Object, Boolean] as PropType<MenuContentRender>,
    default: () => undefined,
  },
  menuExtraRender: {
    type: [Function, Object, Boolean] as PropType<MenuExtraRender>,
    default: () => undefined,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<CollapsedButtonRender>,
    default: () => undefined,
  },
  onMenuHeaderClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>,
  },
  onOpenKeys: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>,
  },
  onSelect: {
    type: Function as PropType<(selectedKeys: WithFalse<string[]>) => void>,
  },
}

export type SiderMenuProps = Partial<ExtractPropTypes<typeof siderMenuProps>>;

export const defaultRenderCollapsedButton = (collapsed?: boolean): CustomRender =>
  collapsed ? <AIcon type={'MenuUnfoldOutlined'} /> : <AIcon type={'MenuFoldOutlined'} />;

const SiderMenu: FunctionalComponent<SiderMenuProps> = (props, { slots, emit}) => {
  const {
    collapsed,
    collapsedWidth = 48,
    menuContentRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,
  } = props;

  const context = useRouteContext();
  const sSideWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth));


  const handleSelect = ($event: string[]) => {
    if (props.onSelect) {
      props.onSelect([context.selectedKeys[0], ...$event]);
    }
  }

  const defaultMenuDom = (
    <BaseMenu
      theme={props.theme as 'dark' | 'light'}
      mode="inline"
      menuData={context.flatMenuData}
      collapsed={props.collapsed}
      openKeys={context.openKeys}
      selectedKeys={context.selectedKeys}
      menuItemRender={props.menuItemRender}
      subMenuItemRender={props.subMenuItemRender}
      onClick={props.onMenuClick}
      style={{
        width: '100%',
      }}
      {...{
        'onUpdate:openKeys': ($event: string[]) => props.onOpenKeys && props.onOpenKeys($event),
        'onUpdate:selectedKeys': handleSelect,
      }}
    />
  )

  const Style = computed(() => {
    return {
      overflow: 'hidden',
      height: '100vh',
      zIndex: 18,
      paddingTop: `${props.headerHeight}px`,
      flex: `0 0 ${sSideWidth.value}px`,
      minWidth: `${sSideWidth.value}px`,
      maxWidth: `${sSideWidth.value}px`,
      width: `${sSideWidth.value}px`,
      transition: 'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s'
    }
  })

  return (
    <>
      <div
        style={Style.value}
      ></div>
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={(collapse: boolean) => {
          props.onCollapse?.(collapse);
        }}
        collapsedWidth={collapsedWidth}
        style={omit(Style.value, ['transition'])}
        width={sSideWidth.value}
        theme={props.theme as 'dark' | 'light'}
        class={'pro-layout-sider'}
      >
        <div style="flex: 1; overflow: hidden auto;">
          {(menuContentRender && menuContentRender(props, defaultMenuDom)) || defaultMenuDom}
        </div>
        <div class={`header-links`}>
          {collapsedButtonRender !== false ? (
            <Menu
              class={`header-link-menu`}
              inlineIndent={16}
              theme={props.theme as 'light' | 'dark'}
              selectedKeys={[]}
              openKeys={[]}
              mode="inline"
              onClick={() => {
                if (props.onCollapse) {
                  props.onCollapse(!props.collapsed);
                }
              }}
            >
              <Menu.Item key={'collapsed-button'} class={`header-collapsed-button`} title={false}>
                {collapsedButtonRender && typeof collapsedButtonRender === 'function'
                  ? collapsedButtonRender(collapsed)
                  : collapsedButtonRender}
              </Menu.Item>
            </Menu>
          ) : null}
        </div>
      </Sider>
    </>
  )
}

export default SiderMenu