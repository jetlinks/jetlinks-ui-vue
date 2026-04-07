export type ActionsItem = {
    action: string;
    describe: string;
    name: string;
    properties?: {
        supportDataAccessTypes: any[]
    }
};

export type PermissionItem = {
    id: string | undefined;
    name: string;
    status: 0 | 1;
    describe: string;
    actions: ActionsItem[];
    modifyTime?: number;
    createTime?: number;
    modifierId?: string;
    creatorId?: string;
};