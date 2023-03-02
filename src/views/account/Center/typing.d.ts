
import { dictType } from '@/views/system/Department/typing';

export type userInfoType = {
    avatar: string;
    createTime: number;
    email: string;
    id: string;
    name: string;
    orgList: dictType;
    roleList: dictType;
    status: number;
    telephone: string;
    tenantDisabled: boolean;
    type: { name: string; id: string };
    username: string;
};