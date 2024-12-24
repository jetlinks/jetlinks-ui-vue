export type TreeType = {
    id: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
    children?: TreeType[];
    disabled?: boolean;
}

export type FormType = {
    id?: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
}

export type dictType = {
    id: string;
    name: string;
}[];

export type optionsType = {
    label: string,
    value: string;
    disabled?:boolean
}[]