import {
  computed,
  reactive,
  unref,
  defineComponent,
  toRefs,
  provide
} from 'vue'

import type { ExtractPropTypes, PropType, CSSProperties} from 'vue'
import { Layout } from 'ant-design-vue'
import { defaultSettingProps } from './defaultSetting'
import type { BreadcrumbProps, RouteContextProps } from './RouteContext'
import type {
  BreadcrumbRender,
  CollapsedButtonRender, CustomRender,
  HeaderRender,
  MenuContentRender,
  MenuExtraRender,
  MenuHeaderRender,
  MenuItemRender,
  RightContentRender,
  SubMenuItemRender
} from './typings'
import SiderMenuWrapper, { siderMenuProps } from 'components/Layout/components/SiderMenu/SiderMenu'
import { getSlot } from '@/utils/comm'
import { getMenuFirstChildren } from 'components/Layout/utils'
import { pick } from 'lodash-es'
import { routeContextInjectKey } from './RouteContext'
import { HeaderView, headerViewProps } from './components/Header'

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...siderMenuProps,
  ...headerViewProps,

  breadcrumb: {
    type: [Object, Function] as PropType<BreadcrumbProps>,
    default: () => null
  },
  breadcrumbRender: {
    type: [Object, Function, Boolean] as PropType<BreadcrumbRender>,
    default() {
      return null
    }
  },
  contentStyle: {
    type: [String, Object] as PropType<CSSProperties>,
    default: () => {
      return null
    }
  },
  pure: {
    type: Boolean,
    default: () => false
  }
}

export type BasicLayoutProps = Partial<ExtractPropTypes<typeof basicLayoutProps>>;

export default defineComponent({
  name: 'ProLayout',
  inheritAttrs: false,
  props: basicLayoutProps,
  emits: [
    'update:collapsed',
    'update:open-keys',
    'update:selected-keys',
    'collapse',
    'openKeys',
    'select',
    'menuHeaderClick',
    'menuClick'
  ],
  setup(props, { emit, attrs, slots }) {
    const siderWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth))

    const onCollapse = (collapsed: boolean) => {
      emit('update:collapsed', collapsed)
      emit('collapse', collapsed)
    }
    const onOpenKeys = (openKeys: string[] | false) => {
      emit('update:open-keys', openKeys)
      emit('openKeys', openKeys)
    }
    const onSelect = (selectedKeys: string[] | false) => {
      emit('update:selected-keys', selectedKeys)
      emit('select', selectedKeys)
    }
    const onMenuHeaderClick = (e: MouseEvent) => {
      emit('menuHeaderClick', e)
    }
    const onMenuClick = (args: any) => {
      emit('menuClick', args)
    }
    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: HeaderRender;
        rightContentRender: RightContentRender;
      },
      matchMenuKeys?: string[]
    ): CustomRender | null => {
      if (p.headerRender === false) {
        return null
      }
      return <HeaderView {...p} />
    }

    const breadcrumb = computed<BreadcrumbProps>(() => ({
      ...props.breadcrumb,
      itemRender: getSlot<BreadcrumbRender>(slots, props, 'breadcrumbRender') as BreadcrumbRender
    }))

    const flatMenuData = computed(
      () => (props.selectedKeys && getMenuFirstChildren(props.menuData, props.selectedKeys[0])) || [])

    const routeContext = reactive<RouteContextProps>({
      ...(pick(toRefs(props), [
        'menuData',
        'openKeys',
        'selectedKeys',
        'contentWidth',
        'headerHeight'
      ]) as any),
      siderWidth,
      breadcrumb,
      flatMenuData
    })

    provide(routeContextInjectKey, routeContext)

    return () => {
      const {
        pure,
        onCollapse: propsOnCollapse,
        onOpenKeys: propsOnOpenKeys,
        onSelect: propsOnSelect,
        onMenuClick: propsOnMenuClick,
        ...restProps
      } = props

      const collapsedButtonRender = getSlot<CollapsedButtonRender>(slots, props, 'collapsedButtonRender')
      const rightContentRender = getSlot<RightContentRender>(slots, props, 'rightContentRender')
      const customHeaderRender = getSlot<HeaderRender>(slots, props, 'headerRender')

      // menu
      const menuHeaderRender = getSlot<MenuHeaderRender>(slots, props, 'menuHeaderRender')
      const menuExtraRender = getSlot<MenuExtraRender>(slots, props, 'menuExtraRender')
      const menuContentRender = getSlot<MenuContentRender>(slots, props, 'menuContentRender')
      const menuItemRender = getSlot<MenuItemRender>(slots, props, 'menuItemRender')
      const subMenuItemRender = getSlot<SubMenuItemRender>(slots, props, 'subMenuItemRender')

      const headerDom = computed(() =>
        headerRender(
          {
            ...props,
            hasSiderMenu: true,
            menuItemRender,
            subMenuItemRender,
            menuData: props.menuData,
            onCollapse,
            onOpenKeys,
            onSelect,
            onMenuHeaderClick,
            rightContentRender,
            collapsedButtonRender,
            menuExtraRender,
            menuContentRender,
            headerRender: customHeaderRender,
            theme: props.navTheme
          },
          []
        )
      )

      return (
        <>
          {
            pure ? (
              slots.default?.()
            ) : (
              <Layout
                class={'pro-layout'}
                style={{
                  minHeight: '100vh'
                }}
              >
                <SiderMenuWrapper
                  {...restProps}
                  theme={props.navTheme}
                  menuHeaderRender={menuHeaderRender}
                  menuExtraRender={menuExtraRender}
                  menuContentRender={menuContentRender}
                  menuItemRender={menuItemRender}
                  subMenuItemRender={subMenuItemRender}
                  collapsedButtonRender={collapsedButtonRender}
                  onCollapse={onCollapse}
                  onSelect={onSelect}
                  onOpenKeys={onOpenKeys}
                  onMenuClick={onMenuClick}
                />

                <Layout>
                  {headerDom.value}
                  <Layout>
                    {slots.default?.()}
                  </Layout>
                </Layout>
              </Layout>
            )
          }
        </>
      )
    }
  }
})




