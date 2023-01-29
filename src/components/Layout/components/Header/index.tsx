import type { ExtractPropTypes, PropType } from 'vue'
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import type { MenuDataItem, WithFalse, ProProps, CustomRender, RightContentRender } from '../../typings'
import { siderMenuProps } from '../SiderMenu/SiderMenu'
import { defaultSettingProps } from 'components/Layout/defaultSetting'
import Header, { headerProps } from './Header'
import { useRouteContext } from 'components/Layout/RouteContext'
import type { RouteRecordRaw } from 'vue-router'
import { clearMenuItem } from 'components/Layout/utils'
import DefaultSetting from '../../../../../config/config'
import { Layout } from 'ant-design-vue'

export const headerViewProps = {
  ...headerProps
}

export type HeaderViewProps = Partial<ExtractPropTypes<typeof headerViewProps>>;

export const HeaderView = defineComponent({
  name: 'HeaderView',
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
    const { headerHeight, onCollapse } = toRefs(props);

    const context = useRouteContext();

    const clearMenuData = computed(
      () => (context.menuData && clearMenuItem(context.menuData as RouteRecordRaw[])) || []
    );

    return () => (
      <>
        <Layout.Header
          style={{
            padding: 0,
            height: `${headerHeight.value}px`,
            lineHeight: `${headerHeight.value}px`,
            width: `100%`,

          }}
        />
        <Layout.Header
          style={{
            padding: 0,
            height: `${headerHeight.value}px`,
            lineHeight: `${headerHeight.value}px`,
            width: `100%`,
            zIndex: 19,
            position: 'fixed',
            top: 0,
            right: 0
          }}
        >
          <Header
            {...props}
            onCollapse={onCollapse.value}
            menuData={clearMenuData.value}
          />
        </Layout.Header>
      </>
    )
}
})