export type Footer = {
    title: string;
    value: number | string;
    total: number | string;
    status?: 'default' | 'error' | 'success' | 'warning' | 'processing' | '';
    type: string;
    label: string;
};
