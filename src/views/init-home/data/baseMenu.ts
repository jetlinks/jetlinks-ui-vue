import {
    USER_CENTER_MENU_BUTTON_CODE,
    USER_CENTER_MENU_CODE
} from '@/utils/consts'

export const USER_CENTER_MENU_DATA = {
    id: '19a1f2c763e1231f1e1',
    accessSupport: {value: 'unsupported', label: '不支持'},
    supportDataAccess: false,
    code: USER_CENTER_MENU_CODE,
    name: '个人中心',
    i18nMessages: {
        name: {
            zh_CN: '个人中心',
            en_US: 'User Center',
            en: 'User Center'
        }
    },
    url: '/account/center',
    sortIndex: 9999,
    granted: true,
    owner: 'iot',
    options: {
        show: true,
    },
    permissions: [
        {
            permission: 'system_config',
            actions: ['query'],
        },
    ],
    buttons: [
        {
            id: 'view',
            name: '查看',
            i18nMessages: {
                zh_CN: "查看",
                en_US: "View",
                en: "View"
            },
            permissions: []
        },
        {
            id: USER_CENTER_MENU_BUTTON_CODE,
            name: '修改密码',
            i18nMessages: {
                zh_CN: "修改密码",
                en_US: "Update Password",
                en: "Update Password"
            },
            permissions: [
                {
                    permission: 'user',
                    actions: ['update-self-pwd']
                },
                {
                    permission: 'system_config',
                    actions: ['query'],
                },
            ]
        }
    ]
}

export default [

];
