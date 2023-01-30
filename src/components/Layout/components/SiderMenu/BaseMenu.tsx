import { isVNode, defineComponent, getCurrentInstance, withCtx } from 'vue'
import type { FunctionalComponent, PropType, VNodeChild, ComponentInternalInstance, ConcreteComponent, ExtractPropTypes, VNode } from 'vue'
import type {
  MenuDataItem,
  WithFalse,
  MenuItemRender,
  LayoutType,
  MenuTheme,
  SubMenuItemRender,
  MenuMode
} from '../../typings'
import type {
  SelectEventHandler,
  MenuClickEventHandler,
  SelectInfo,
  MenuInfo,
} from 'ant-design-vue/es/menu/src/interface';
import type { Key } from 'ant-design-vue/es/_util/type';
import IconFont from '@/components/AIcon'
import { Menu } from 'ant-design-vue';
import { isUrl } from '@/utils/regular'

export const baseMenuProps = {
  mode: {
    type: String as PropType<MenuMode>,
    default: 'inline',
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  layout: {
    type: String as PropType<LayoutType>,
    default: 'side',
  },
  theme: {
    type: String as PropType<MenuTheme | 'realDark'>,
    default: 'dark',
  },
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: () => false,
  },
  openKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined,
  },
  selectedKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined,
  },
  menuProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => null,
  },
  menuItemRender: {
    type: [Object, Function, Boolean] as PropType<MenuItemRender>,
    default: () => undefined,
  },
  subMenuItemRender: {
    type: [Object, Function, Boolean] as PropType<SubMenuItemRender>,
    default: () => undefined,
  },
  onClick: [Function, Object] as PropType<(...args: any) => void>,
}

export type BaseMenuProps = ExtractPropTypes<typeof baseMenuProps>;

const LazyIcon: FunctionalComponent<{ icon:  VNodeChild | string;}> = (props) => {
  const {icon} = props
  if (!icon) return null
  if (typeof icon === 'string' && icon !== '') {
    return <IconFont type={icon} />;
  }
  if (isVNode(icon)) {
    return icon;
  }
}

class MenuUtil {
  props: BaseMenuProps;
  ctx: ComponentInternalInstance | null;
  RouterLink: ConcreteComponent;

  constructor(props: BaseMenuProps, ctx: ComponentInternalInstance | null) {
    this.props = props
    this.ctx = ctx
    this.RouterLink = resolveComponent('router-link') as ConcreteComponent
  }

  getNavMenuItems = (menusData: MenuDataItem[] = []) => {
    return menusData.map((item) => this.getSubMenuOrItem(item)).filter((item) => item);
  };

  getSubMenuOrItem = (item: MenuDataItem): VNode => {
    if (
      Array.isArray(item.children) &&
      item.children.length > 0 &&
      !item?.meta?.hideInMenu &&
      !item?.meta?.hideChildrenInMenu
    ) {
      if (this.props.subMenuItemRender) {
        const subMenuItemRender = withCtx(this.props.subMenuItemRender, this.ctx);
        return subMenuItemRender({
          item,
          children: this.getNavMenuItems(item.children),
        }) as VNode;
      }
      const menuTitle = item.meta?.title


      const defaultTitle = item.meta?.icon ? (
        <span class={`header-menu-item`}>
          <span class={`header-menu-item-title`}>{menuTitle}</span>
        </span>
      ) : (
        <span class={`header-menu-item`}>{menuTitle}</span>
      );

      return (
        <Menu.SubMenu
          title={defaultTitle}
          key={item.path}
          icon={<LazyIcon icon={item.meta?.icon} />}
        >
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      )
    }

    const menuItemRender = this.props.menuItemRender && withCtx(this.props.menuItemRender, this.ctx);

    const [title, icon] = this.getMenuItem(item);

    return (
      (menuItemRender && (menuItemRender({ item, title, icon }) as VNode)) || (
        <Menu.Item disabled={item.meta?.disabled} danger={item.meta?.danger} key={item.path}>
          {title}
        </Menu.Item>
      )
    )
  }

  getMenuItem = (item: MenuDataItem) => {
    const meta = { ...item.meta };
    const target = (meta.target || null) as string | null;
    const hasUrl = isUrl(item.path);
    const CustomTag: any = (target && 'a') || this.RouterLink;
    const props = { to: { path: item.path, ...item.meta } };
    const attrs = hasUrl || target ? { ...item.meta, href: item.path, target } : {};

    const icon = (item.meta?.icon && <LazyIcon icon={item.meta.icon} />) || undefined;
    const menuTitle = item.meta?.title;
    const defaultTitle = item.meta?.icon ? (
      <CustomTag {...attrs} {...props} class={`header-menu-item`}>
        {icon}
        <span class={`header-menu-item-title`}>{menuTitle}</span>
      </CustomTag>
    ) : (
      <CustomTag {...attrs} {...props} class={`header-menu-item`}>
        <span>{menuTitle}</span>
      </CustomTag>
    );

    return [defaultTitle, icon];
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  }
}

export default defineComponent({
  name: 'BaseMenu',
  props: baseMenuProps,
  emits: ['update:openKeys', 'update:selectedKeys', 'click'],
  setup(props, { emit }) {
    const ctx = getCurrentInstance()

    const menuUtil = new MenuUtil(props, ctx);

    const handleOpenChange = (openKeys: Key[]): void => {
      emit('update:openKeys', openKeys);
    };

    const handleSelect: SelectEventHandler = (args: SelectInfo): void => {
      // ignore https? link handle selectkeys
      if (isUrl(args.key as string)) {
        return;
      }
      emit('update:selectedKeys', args.selectedKeys);
    };

    const handleClick: MenuClickEventHandler = (args: MenuInfo) => {
      emit('click', args);
    };

    return () => (
      <Menu
        {...props}
        key='Menu'
        inlineIndent={16}
        theme={props.theme as 'dark' | 'light'}
        openKeys={props.openKeys === false ? [] : props.openKeys}
        selectedKeys={props.selectedKeys || []}
        onOpenChange={handleOpenChange}
        onSelect={handleSelect}
        onClick={handleClick}
      >
        {menuUtil.getNavMenuItems(props.menuData)}
      </Menu>
    )
  }
})