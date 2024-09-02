import {
  USER_CENTER_MENU_BUTTON_CODE,
  USER_CENTER_MENU_CODE
} from '@/utils/consts'

export const USER_CENTER_MENU_DATA = {
  id: '19a1f2c763e1231f1e1',
  accessSupport: { value: 'unsupported', label: '不支持'},
  supportDataAccess: false,
  code: USER_CENTER_MENU_CODE,
  name: '个人中心',
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
      permissions: [

      ]
    },
    {
      id: USER_CENTER_MENU_BUTTON_CODE,
      name: '修改密码',
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
        accessSupport: { text: "不支持", value: "unsupported" },
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
        buttons: [
          {
            id: 'view',
            name: '查看',
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
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'organization',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: "支持", value: "support" },
        supportDataAccess: true,
        assetType: 'user'
      },
      {
        code: 'system/Department',
        name: '组织管理',
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
        accessSupport: { text: "支持", value: "support" },
        supportDataAccess: true,
        assetType: 'organization'
      },
      {
        code: 'system/Role',
        name: '角色管理',
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
          {
            id: 'groupUpdate',
            name: '角色组编辑',
            permissions: [
              {
                permission: 'role-group',
                actions: ['query','save']
              }
            ],
          },
          {
            id: 'groupDelete',
            name: '角色组删除',
            permissions: [
              {
                permission: 'role-group',
                actions: ['query','delete']
              }
            ],
          },
        ],
        accessSupport: { text: "支持", value: "support" },
        supportDataAccess: true,
        assetType: 'role'
      },
      {
        code: 'system/Menu',
        name: '菜单管理',
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
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Permission',
        name: '权限管理',
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
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save', 'grant'],
              },
            ],
          },
        ],
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/NoticeRule',
        name: '订阅管理',
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
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Dictionary',
        name: '数据字典',
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
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Region',
        name: '地区管理',
        owner: 'iot',
        id: 'b69782873cc24be8165c6ad29233333',
        sortIndex: 13,
        url: '/system/region',
        icon: 'EnvironmentOutlined',
        showPage: ['area'],
        permissions: [],
        buttons: [
          {
            id: "add",
            name: "新增",
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
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Calendar',
        name: '日历维护',
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
        accessSupport: { text: "不支持", value: "unsupported" },
        supportDataAccess: false
      },
    ],
  },
];
