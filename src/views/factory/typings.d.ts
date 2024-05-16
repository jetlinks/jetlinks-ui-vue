export interface FormState {
    id: string;
    name: string;
    position: string;
    url: string;
    port: string;
    appId: string;
    secureKey?: string;
    groupId: string;
    description?: string;
}

export interface ActionsType {
    key: string;
    text?: string;
    disabled?: boolean;
    permission?: boolean;
    onClick?: (data: any) => void;
    style?: CSSProperties;
    tooltip?: TooltipProps;
    popConfirm?: PopconfirmProps;
    icon?: string;
    children?: ActionsType[];
  }