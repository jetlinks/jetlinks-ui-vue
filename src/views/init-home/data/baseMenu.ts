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
    // 系统管理
    {
        code: 'system',
        name: '系统管理',
        owner: 'iot',
        i18nMessages: {
            name: {
                zh_CN: "系统管理",
                en_US: "System Management",
                en: "System Management"
            }
        },
        id: 'fd1670b860ae58cc58bcd01d027ccd35',
        url: '/system',
        icon: 'icon-xitongguanli1',
        sortIndex: 4,
        permissions: [],
        buttons: [],
        children: [
            {
                code: 'system/Basis',
                name: '基础配置',
                i18nMessages: {
                    name: {
                        zh_CN: "基础配置",
                        en_US: "Basic Configuration",
                        en: "Basic Configuration"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: '96e4bd287adbe0486e2168c59450841f',
                sortIndex: 1,
                url: '/system/Basis',
                icon: 'icon-shezhi',
                showPage: ['system_config'],
                permissions: [],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'system_config',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '保存',
                        i18nMessages: {
                            zh_CN: "保存",
                            en_US: "Save",
                            en: "Save"
                        },
                        permissions: [
                            {
                                permission: 'system_config',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/User',
                name: '用户管理',
                owner: 'iot',
                //parentId: '3',
                id: 'fe2e557bcf09a5503cbb5bebeb0b7f1c',
                sortIndex: 2,
                url: '/system/user',
                icon: 'icon-yonghuguanli',
                showPage: ['user'],
                permissions: [],
                i18nMessages: {
                    name: {
                        zh_CN: "用户管理",
                        en_US: "User Management",
                        en: "User Management"
                    }
                },
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: "启/禁用",
                            en_US: "Enable/Disable",
                            en: "Enable/Disable"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query', 'save', 'update-self-info'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query', 'save', 'update-self-info', 'update-self-pwd'],
                            },
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'organization',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'role-group',
                                actions: ['query'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'organization',
                                actions: ['query'],
                            },
                            {
                                permission: "position",
                                actions: [
                                    "query",
                                ]
                            }
                        ],
                    },
                ],
                accessSupport: {text: "支持", value: "support"},
                supportDataAccess: true,
                assetType: 'user'
            },
            {
                code: 'system/Department',
                name: '组织管理',
                i18nMessages: {
                    name: {
                        zh_CN: "组织管理",
                        en_US: "Organization Management",
                        en: "Organization Management"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: '3962ec0835f3b4a68c1f63b955625046',
                sortIndex: 3,
                url: '/system/Department',
                icon: 'icon-bumenguanli',
                showPage: ['organization'],
                permissions: [],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'organization',
                                actions: ['query'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'bind',
                        name: '资产解绑',
                        i18nMessages: {
                            zh_CN: "资产解绑",
                            en_US: "Assets Unbind",
                            en: "Assets Unbind"
                        },
                        permissions: [
                            {
                                permission: 'assets-bind',
                                actions: ['unbind', 'query'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'organization',
                                actions: ['unbind-user'],
                            },
                        ],
                    },
                    {
                        id: 'bind-user',
                        name: '绑定用户',
                        i18nMessages: {
                            zh_CN: "绑定用户",
                            en_US: "Bind User",
                            en: "Bind User"
                        },
                        permissions: [
                            {
                                permission: 'organization',
                                actions: ['unbind-user', 'query', 'bind-user'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'assert',
                        name: '资产分配',
                        i18nMessages: {
                            zh_CN: "资产分配",
                            en_US: "Assets Allocation",
                            en: "Assets Allocation"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-category',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['bind', 'unbind', 'query', 'permission'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'organization',
                                actions: ['delete'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'organization',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'organization',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-product',
                                actions: ['query'],
                            },
                            {
                                permission: 'device-instance',
                                actions: ['query'],
                            },
                            {
                                permission: 'assets-bind',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "支持", value: "support"},
                supportDataAccess: true,
                assetType: 'organization'
            },
            {
                code: 'system/Role',
                name: '角色管理',
                i18nMessages: {
                    name: {
                        zh_CN: "角色管理",
                        en_US: "Role Management",
                        en: "Role Management"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: '9d1e96f17649ef5e7b8e7c6bb8e7b775',
                sortIndex: 4,
                url: '/system/Role',
                icon: 'icon-jiaoseguanli',
                showPage: ['role'],
                permissions: [
                    {
                        permission: 'role',
                        actions: ['query'],
                    },
                ],
                buttons: [
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'role',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'menu',
                                actions: ['grant'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'user',
                                actions: ['query'],
                            },
                            {
                                permission: 'role',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'menu',
                                actions: ['grant'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'role-group',
                                actions: ['query']
                            }
                        ],
                    },
                    // {
                    //     id: 'groupAdd',
                    //     name: '角色组新增',
                    //     i18nMessages: {
                    //         zh_CN: "角色组新增",
                    //         en_US: "Role Group Add",
                    //         en: "Role Group Add"
                    //     },
                    //     permissions: [
                    //         {
                    //             permission: 'role-group',
                    //             actions: ['query', 'save']
                    //         }
                    //     ],
                    // },
                    // {
                    //     id: 'groupUpdate',
                    //     name: '角色组编辑',
                    //     i18nMessages: {
                    //         zh_CN: "角色组编辑",
                    //         en_US: "Role Group Edit",
                    //         en: "Role Group Edit"
                    //     },
                    //     permissions: [
                    //         {
                    //             permission: 'role-group',
                    //             actions: ['query', 'save']
                    //         }
                    //     ],
                    // },
                    // {
                    //     id: 'groupDelete',
                    //     name: '角色组删除',
                    //     i18nMessages: {
                    //         zh_CN: "角色组删除",
                    //         en_US: "Delete Role Group",
                    //         en: "Delete Role Group"
                    //     },
                    //     permissions: [
                    //         {
                    //             permission: 'role-group',
                    //             actions: ['query', 'delete']
                    //         }
                    //     ],
                    // },
                ],
                accessSupport: {text: "支持", value: "support"},
                supportDataAccess: true,
                assetType: 'role'
            },
            {
                code: 'system/Menu',
                name: '菜单管理',
                i18nMessages: {
                    name: {
                        zh_CN: "菜单管理",
                        en_US: "Menu Management",
                        en: "Menu Management"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: 'dcb6fa15da2eae8a4fdb71755edbc2bb',
                sortIndex: 5,
                url: '/system/Menu',
                icon: 'icon-caidanguanli',
                showPage: ['menu'],
                permissions: [],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'menu',
                                actions: ['query'],
                            },
                            {
                                permission: 'permission',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'assets-bind',
                                actions: ['bind', 'unbind', 'query', 'permission'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'menu',
                                actions: ['query', 'save', 'grant'],
                            },
                            {
                                permission: 'permission',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'menu',
                                actions: ['query', 'grant', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'assets-bind',
                                actions: ['bind', 'unbind', 'query', 'permission'],
                            },
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'menu',
                                actions: ['query', 'save', 'grant'],
                            },
                            {
                                permission: 'permission',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Permission',
                name: '权限管理',
                i18nMessages: {
                    name: {
                        zh_CN: "权限管理",
                        en_US: "Permission Management",
                        en: "Permission Management"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: 'da14fad88888dc13024e8261ff8fc2b5',
                sortIndex: 6,
                url: '/system/Permission',
                icon: 'icon-quanxianguanli',
                showPage: ['permission'],
                permissions: [],
                buttons: [
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: "启/禁用",
                            en_US: "Enable/Disable",
                            en: "Enable/Disable"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query', 'save'],
                            },
                        ],
                    },
                    {
                        id: 'export',
                        name: '导出',
                        i18nMessages: {
                            zh_CN: "导出",
                            en_US: "Export",
                            en: "Export"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'import',
                        name: '导入',
                        i18nMessages: {
                            zh_CN: "导入",
                            en_US: "Import",
                            en: "Import"
                        },
                        permissions: [
                            {
                                permission: 'file',
                                actions: ['upload-static'],
                            },
                            {
                                permission: 'permission',
                                actions: ['query', 'save'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query', 'save', 'grant'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'permission',
                                actions: ['query', 'save', 'grant'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Relationship',
                name: '关系配置',
                i18nMessages: {
                    name: {
                        zh_CN: "关系配置",
                        en_US: "Relationship Configuration",
                        en: "Relationship Configuration"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: '2fa02b8758fe82a6b9666f4ebb1bbd03',
                sortIndex: 7,
                url: '/system/Relationship',
                icon: 'icon-shuxingpeizhi',
                showPage: ['relation'],
                permissions: [],
                buttons: [
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'relation',
                                actions: ['query', 'save'],
                            },
                        ],
                    },
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'relation',
                                actions: ['query', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'relation',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'relation',
                                actions: ['query', 'save'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Platforms/Setting',
                name: 'API配置',
                owner: 'iot',
                //parentId: '3',
                id: '8750142230773cde42a4e28efa7f84d5',
                sortIndex: 9,
                url: '/system/Api',
                icon: 'icon-chakanAPI',
                showPage: ['open-api'],
                i18nMessages: {
                    name: {
                        zh_CN: "API配置",
                        en_US: "API Configuration",
                        en: "API Configuration"
                    }
                },
                permissions: [
                    {
                        permission: 'open-api',
                        actions: ['query', 'save'],
                    },
                    {
                        permission: 'application',
                        actions: ['query'],
                    },
                ],
                buttons: [
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "edit",
                            en: "edit"
                        },
                        permissions: [
                            {
                                permission: 'open-api',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'application',
                                actions: ['save'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "see",
                            en: "see"
                        },
                        permissions: [
                            {
                                permission: 'open-api',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: { text: "不支持", value: "unsupported" },
                supportDataAccess: false
            },
            {
                code: 'system/Apply',
                name: '应用管理',
                i18nMessages: {
                    name: {
                        zh_CN: "应用管理",
                        en_US: "Application Management",
                        en: "Application Management"
                    }
                },
                owner: 'iot',
                //parentId: '3',
                id: 'e0640f9621c21078cad62d5646a5579d',
                sortIndex: 10,
                url: '/system/Apply',
                icon: 'icon-yingyongguanli',
                showPage: ['application'],
                permissions: [],
                buttons: [
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'application',
                                actions: ['query', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'menu',
                                actions: ['query'],
                            },
                            {
                                permission: 'application',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'open-api',
                                actions: ['query', 'save', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'menu',
                                actions: ['query'],
                            },
                            {
                                permission: 'application',
                                actions: ['query', 'save'],
                            },
                            {
                                permission: 'open-api',
                                actions: ['query', 'save', 'delete'],
                            },
                        ],
                    },
                    {
                        id: 'view',
                        name: '查看',
                        i18nMessages: {
                            zh_CN: "查看",
                            en_US: "View",
                            en: "View"
                        },
                        permissions: [
                            {
                                permission: 'application',
                                actions: ['query'],
                            },
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: "启/禁用",
                            en_US: "Enable/Disable",
                            en: "Enable/Disable"
                        },
                        permissions: [
                            {
                                permission: 'application',
                                actions: ['save'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/NoticeRule',
                name: '订阅管理',
                i18nMessages: {
                    name: {
                        zh_CN: "订阅管理",
                        en_US: "Subscription Management",
                        en: "Subscription Management"
                    }
                },
                owner: 'iot',
                id: '522f790d4422a608d491bc9e2fa12b4e',
                sortIndex: 11,
                url: '/system/NoticeRule',
                icon: 'CopyOutlined',
                showPage: ['notify-channel'],
                permissions: [],
                buttons: [
                    {
                        id: 'delete',
                        name: '删除',
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'notify-channel',
                                actions: ['save', 'delete'],
                            },
                            {
                                permission: 'notifier',
                                actions: ['query'],
                            },
                            {
                                permission: 'template',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'add',
                        name: '新增',
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'notify-channel',
                                actions: ['save'],
                            },
                            {
                                permission: 'notifier',
                                actions: ['query'],
                            },
                            {
                                permission: 'template',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'update',
                        name: '编辑',
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'notify-channel',
                                actions: ['save', 'query'],
                            },
                            {
                                permission: 'notifier',
                                actions: ['query'],
                            },
                            {
                                permission: 'template',
                                actions: ['query'],
                            },
                        ],
                    },
                    {
                        id: 'action',
                        name: '启/禁用',
                        i18nMessages: {
                            zh_CN: "启/禁用",
                            en_US: "Enable/Disable",
                            en: "Enable/Disable"
                        },
                        permissions: [
                            {
                                permission: 'role',
                                actions: ['query'],
                            },
                            {
                                permission: 'notify-channel',
                                actions: ['save'],
                            },
                            {
                                permission: 'notifier',
                                actions: ['query'],
                            },
                            {
                                permission: 'template',
                                actions: ['query'],
                            },
                        ],
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Dictionary',
                name: '数据字典',
                i18nMessages: {
                    name: {
                        zh_CN: "数据字典",
                        en_US: "Data Dictionary",
                        en: "Data Dictionary"
                    }
                },
                owner: 'iot',
                id: 'b69782873cc24be8165c6ad292359092',
                sortIndex: 12,
                url: '/system/Dictionary',
                icon: 'FormOutlined',
                showPage: ['dictionary'],
                permissions: [],
                buttons: [
                    {
                        id: "add",
                        name: "新增",
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "delete",
                        name: "删除",
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "delete"
                                ]
                            }
                        ]
                    },
                    {
                        id: "update",
                        name: "编辑",
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "import",
                        name: "导入",
                        i18nMessages: {
                            zh_CN: "导入",
                            en_US: "Import",
                            en: "Import"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "down",
                        name: "下载",
                        i18nMessages: {
                            zh_CN: "下载",
                            en_US: "Download",
                            en: "Download"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "query"
                                ]
                            }
                        ]
                    },
                    {
                        id: "action",
                        name: "启用/禁用",
                        i18nMessages: {
                            zh_CN: "启用/禁用",
                            en_US: "Enable/Disable",
                            en: "Enable/Disable"
                        },
                        permissions: [
                            {
                                permission: "dictionary",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    }
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Region',
                name: '地区管理',
                i18nMessages: {
                    name: {
                        zh_CN: "地区管理",
                        en_US: "Area Management",
                        en: "Area Management"
                    }
                },
                owner: 'iot',
                id: 'b69782873cc24be8165c6ad29233333',
                sortIndex: 13,
                url: '/system/region',
                icon: 'EnvironmentOutlined',
                showPage: ['area'],
                permissions: [
                    {
                        permission: "area",
                        actions: ["query"]
                    }
                ],
                buttons: [
                    {
                        id: "add",
                        name: "新增",
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: "area",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "delete",
                        name: "删除",
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: "area",
                                actions: [
                                    "delete"
                                ]
                            }
                        ]
                    },
                    {
                        id: "update",
                        name: "编辑",
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: "area",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                code: 'system/Calendar',
                name: '日历维护',
                i18nMessages: {
                    name: {
                        zh_CN: "日历维护",
                        en_US: "Calendar Maintenance",
                        en: "Calendar Maintenance"
                    }
                },
                owner: 'iot',
                id: '9d03fb403f3edb4ceb796dd81167562f',
                showPage: ["calendar-manager"],
                sortIndex: 14,
                url: '/system/Calendar',
                icon: 'icon-rili',
                permissions: [
                    {
                        permission: "calendar-manager",
                        actions: [
                            "query",
                        ]
                    }
                ],
                buttons: [
                    {
                        id: "add",
                        name: "新增",
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                        permissions: [
                            {
                                permission: "calendar-manager",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "update",
                        name: "编辑",
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                        permissions: [
                            {
                                permission: "calendar-manager",
                                actions: [
                                    "save"
                                ]
                            }
                        ]
                    },
                    {
                        id: "delete",
                        name: "删除",
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                        permissions: [
                            {
                                permission: "calendar-manager",
                                actions: [
                                    "delete"
                                ]
                            }
                        ]
                    }
                ],
                accessSupport: {text: "不支持", value: "unsupported"},
                supportDataAccess: false
            },
            {
                "id": "c22370da99f05c1e44c5fe1cd4973633",
                "sortIndex": 15,
                "level": 2,
                "owner": "iot",
                "name": "职位管理",
                "code": "system/Positions",
                "url": "/system/positions",
                "icon": "icon-yonghuguanli",
                "permissions": [
                    {
                        permission: "position",
                        actions: [
                            "query",
                        ]
                    }
                ],
                showPage: ["position"],
                i18nMessages: {
                    name: {
                        zh_CN: "职位管理",
                        en_US: "Positions Management",
                        en: "Positions Management"
                    }
                },
                "buttons": [
                    {
                        "id": "add",
                        "name": "新增",
                        "permissions": [
                            {
                                "permission": "position",
                                "actions": [
                                    "save"
                                ]
                            }
                        ],
                        i18nMessages: {
                            zh_CN: "新增",
                            en_US: "Add",
                            en: "Add"
                        },
                    },
                    {
                        "id": "delete",
                        "name": "删除",
                        "permissions": [
                            {
                                "permission": "position",
                                "actions": [
                                    "delete"
                                ]
                            }
                        ],
                        i18nMessages: {
                            zh_CN: "删除",
                            en_US: "Delete",
                            en: "Delete"
                        },
                    },
                    {
                        "id": "update",
                        "name": "编辑",
                        "permissions": [
                            {
                                "permission": "position",
                                "actions": [
                                    "save"
                                ]
                            }
                        ],
                        i18nMessages: {
                            zh_CN: "编辑",
                            en_US: "Edit",
                            en: "Edit"
                        },
                    }
                ],
                "accessSupport": {
                    "text": "间接支持",
                    "value": "indirect"
                },
                "supportDataAccess": false,
                "indirectMenus": [
                    "3962ec0835f3b4a68c1f63b955625046"
                ]
            }
        ],
    },
    {
        code: 'iot',
        name: '物联网',
        i18nMessages: {
            name: {
                zh_CN: "物联网",
                en_US: "IoT",
                en: "IoT"
            }
        },
        owner: 'iot',
        id: '9c21f88182e7cc75cbdfa8e4b7844272',
        url: '/iot',
        icon: 'icon-wulianwang',
        sortIndex: 1,
        permissions: [],
        children: [
            {
                code: 'link',
                name: '运维管理',
                i18nMessages: {
                    name: {
                        zh_CN: "运维管理",
                        en_US: "Operation Management",
                        en: "Operation Management"
                    }
                },
                owner: 'iot',
                //parentId: '1',
                id: 'bd55cdc9d0c1700afe628f572f91c22e',
                url: '/iot/link',
                icon: 'icon-yunweiguanli-1',
                permissions: [],
                sortIndex: 4,
                children: [
                    {
                        code: 'Log',
                        name: '日志管理',
                        i18nMessages: {
                            name: {
                                zh_CN: "日志管理",
                                en_US: "Log Management",
                                en: "Log Management"
                            }
                        },
                        owner: 'iot',
                        //parentId: '1-4',
                        id: 'c340f8977e0d221da893715cab58ae8c',
                        sortIndex: 4,
                        url: '/iot/link/Log',
                        icon: 'icon-rizhifuwu',
                        showPage: ['system-logger', 'access-logger'],
                        permissions: [
                            {
                                permission: 'system-logger',
                                actions: ['query'],
                            },
                            {
                                permission: 'access-logger',
                                actions: ['self-data', 'query'],
                            },
                        ],
                        buttons: [],
                        accessSupport: {text: "不支持", value: "unsupported"},
                        supportDataAccess: false
                    },
                ],
            },
        ]
    }
];
