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