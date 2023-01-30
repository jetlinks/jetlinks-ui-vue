import type { VNodeChild, CSSProperties, VNode } from 'vue';

export interface Tab {
  key: string;
  tab: string | VNode | JSX.Element;
}

export type TabBarType = 'line' | 'card' | 'editable-card';
export type TabSize = 'default' | 'large' | 'small';
export type TabPosition = 'left' | 'right';
export type TabBarExtraPosition = TabPosition;

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, VNodeChild>>;

export type TabBarExtraContent = VNodeChild | TabBarExtraMap;

export interface TabsProps {
  prefixCls?: string;
  class?: string | string[];
  style?: CSSProperties;
  id?: string;

  activeKey?: string;
  hideAdd?: boolean;
  // Unchangeable
  // size?: TabSize;
  tabBarStyle?: CSSProperties;
  tabPosition?: TabPosition;
  type?: TabBarType;
  tabBarGutter?: number;
}

export interface AffixProps {
  offsetBottom: number;
  offsetTop: number;
  target?: () => HTMLElement;

  onChange?: (affixed: boolean) => void;
}

export interface TabPaneProps {
  tab?: string | VNodeChild | JSX.Element;
  class?: string | string[];
  style?: CSSProperties;
  disabled?: boolean;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: VNodeChild | JSX.Element;

  prefixCls?: string;
  tabKey?: string;
  id: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}