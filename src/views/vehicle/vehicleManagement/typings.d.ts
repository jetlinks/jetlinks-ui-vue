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

type PropertyData = {
    data: {
        value?:
            | {
                  formatValue: string;
                  property: string;
                  value: any;
              }
            | any;
        timeString: string;
        timestamp: number;
        formatValue: string;
        property: string;
    };
};
