import type { VNode, Slots } from 'vue';
import { BreadcrumbProps } from 'components/Layout/RouteContext'
import { VueNode } from 'ant-design-vue/es/_util/type'

export interface MetaRecord {
  /**
   * @name 菜单的icon
   */
  icon?: string | VNode;
  /**
   * @name 自定义菜单的国际化 key，如果没有则返回自身
   */
  title?: string;
  /**
   * @name 在菜单中隐藏子节点
   */
  hideChildInMenu?: boolean;
  /**
   * @name 在菜单中隐藏自己和子节点
   */
  hideInMenu?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface MenuDataItem {
  /**
   * @name 用于标定选中的值，默认是 path
   */
  path: string;
  name?: string | symbol;
  meta?: MetaRecord;
  /**
   * @name 子菜单
   */
  children?: MenuDataItem[];
}
export type Theme = 'dark' | 'light';

export type MenuTheme = Theme;
export type MenuMode = 'horizontal' | 'vertical' | 'inline';
export type LayoutType = 'side' | 'top' | 'mix';
export type ProProps = Record<never, never>;
export type TargetType = '_blank' | '_self' | unknown;
export type BreadcrumbRender = BreadcrumbProps['itemRender'];

export type CustomRender = VueNode;
export type WithFalse<T> = T | false;
export type LogoRender = WithFalse<CustomRender>;

export type DefaultPropRender = WithFalse<CustomRender>;
export type HeaderContentRender = WithFalse<() => CustomRender>;
export type HeaderRender = WithFalse<(props: ProProps) => CustomRender>;
export type FooterRender = WithFalse<(props: ProProps) => CustomRender>;
export type RightContentRender = WithFalse<(props: ProProps) => CustomRender>;
export type MenuItemRender = WithFalse<
  (args: { item: MenuDataItem; title?: JSX.Element; icon?: JSX.Element }) => CustomRender
  >;
export type SubMenuItemRender = WithFalse<(args: { item: MenuDataItem; children?: CustomRender[] }) => CustomRender>;
export type MenuHeaderRender = WithFalse<(logo: CustomRender, title: CustomRender, props?: ProProps) => CustomRender>;
export type MenuContentRender = WithFalse<(props: ProProps, defaultDom: CustomRender) => CustomRender>;
export type MenuFooterRender = WithFalse<(props?: ProProps) => CustomRender>;
export type MenuExtraRender = WithFalse<(props?: ProProps) => CustomRender>;

export type CollapsedButtonRender = WithFalse<(collapsed?: boolean) => CustomRender>;

export type PageHeaderRender = WithFalse<(props?: ProProps) => CustomRender>;

