import type { ComputedRef, VNodeChild, InjectionKey } from 'vue'
import type { PureSettings } from 'components/Layout/defaultSetting'
import type { MenuDataItem } from 'components/Layout/typings'
import { useContext } from 'components/Layout/hooks/context'

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

export interface BreadcrumbProps {
  prefixCls?: string;
  routes?: Route[];
  params?: any;
  separator?: VNodeChild;
  itemRender?: (opts: { route: Route; params: any; routes: Array<Route>; paths: Array<string> }) => VNodeChild;
}

export type BreadcrumbListReturn = Pick<BreadcrumbProps, Extract<keyof BreadcrumbProps, 'routes' | 'itemRender'>>;

export interface MenuState {
  selectedKeys: string[];
  openKeys: string[];
}

export interface RouteContextProps extends Partial<PureSettings>, MenuState {
  menuData: MenuDataItem[];
  flatMenuData?: MenuDataItem[];

  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  breadcrumb?: BreadcrumbListReturn | ComputedRef<BreadcrumbListReturn>;
  collapsed?: boolean;
  hasSideMenu?: boolean;
  siderWidth?: number;
  headerHeight?: number;
  /* 附加属性 */
  [key: string]: any;
}

export const routeContextInjectKey: InjectionKey<RouteContextProps> = Symbol('route-context');

export const useRouteContext = () =>
  useContext<Required<RouteContextProps>>(routeContextInjectKey, {});

