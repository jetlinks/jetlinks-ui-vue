export type Agg = {
    duration: number;
    total: number;
};

export type AggPlaying = {
    playerTotal: number;
    playingTotal: number;
};

export type Footer = {
    title: string;
    value: number | string;
    total: number | string;
    status?: 'default' | 'error' | 'success' | 'warning' | 'processing' | '';
    type: string;
    label: string;
};
