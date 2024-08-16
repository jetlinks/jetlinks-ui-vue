import i18n from '@/i18n'
const $t = i18n.global.t
import {
  USER_CENTER_MENU_BUTTON_CODE,
  USER_CENTER_MENU_CODE
} from '@/utils/consts'

export const USER_CENTER_MENU_DATA = {
  id: '19a1f2c763e1231f1e1',
  accessSupport: { value: 'unsupported', label: $t('data.baseMenu.633486-0')},
  supportDataAccess: false,
  code: USER_CENTER_MENU_CODE,
  name: $t('data.baseMenu.633486-1'),
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
      name: $t('data.baseMenu.633486-2'),
      permissions: [

      ]
    },
    {
      id: USER_CENTER_MENU_BUTTON_CODE,
      name: $t('data.baseMenu.633486-3'),
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
  // 物联网
  {
    code: 'iot',
    name: $t('data.baseMenu.633486-4'),
    owner: 'iot',
    id: '9c21f88182e7cc75cbdfa8e4b7844272',
    url: '/iot',
    icon: 'icon-wulianwang',
    sortIndex: 1,
    permissions: [],
    children: [
      {
        code: 'home',
        name: $t('data.baseMenu.633486-5'),
        owner: 'iot',
        //parentId: '1',
        id: 'd56cfb0076ecc4ff2d8503b39b3dbf1c',
        url: '/iot/home',
        icon: 'icon-zhihuishequ',
        sortIndex: 1,
        showPage: ['dashboard', 'device-instance', 'device-product'],
        permissions: [
          {
            permission: 'device-product',
            actions: ['query'],
          },
          {
            permission: 'device-instance',
            actions: ['query'],
          },
          {
            permission: 'dashboard',
            actions: ['query'],
          },
          {
            permission: 'system_config',
            actions: ['query'],
          },
          {
            permission: 'open-api',
            actions: ['query'],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'notice',
        name: $t('data.baseMenu.633486-6'),
        owner: 'iot',
        //parentId: '1',
        id: 'b27e972543cdc5da5730b6d4b9b537b1',
        url: '/iot/notice',
        icon: 'icon-tongzhiguanli',
        sortIndex: 2,
        showPage: ['template', 'notifier'],
        permissions: [],
        children: [
          {
            code: 'notice/Config',
            name: $t('data.baseMenu.633486-7'),
            owner: 'iot',
            //parentId: '1',
            id: '09bcab0a6a1f0796075254a453139287',
            url: '/iot/notice/Config',
            icon: 'icon-tongzhiguanli',
            sortIndex: 1,
            showPage: ['notifier'],
            permissions: [{ permission: 'notifier', actions: ['query', 'save', 'delete', 'send'] }],
            buttons: [
              {
                id: 'bind',
                name: $t('data.baseMenu.633486-8'),
                permissions: [
                  {
                    permission: 'add',
                    actions: ['query'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['save'],
                  },
                  {
                    permission: 'user-third-party-manager',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'log',
                name: $t('data.baseMenu.633486-9'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  // {
                  //   permission: 'template',
                  //   actions: ['query'],
                  // },
                ],
              },
              {
                id: 'debug',
                name: $t('data.baseMenu.633486-10'),
                permissions: [
                  {
                    permission: 'add',
                    actions: ['query'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query', 'send'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: $t('data.baseMenu.633486-11'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: $t('data.baseMenu.633486-12'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'notifyConfig'
          },
          {
            code: 'notice/Template',
            name: $t('data.baseMenu.633486-17'),
            owner: 'iot',
            //parentId: '1',
            id: '705b82c807fa18360bf62a2b35f454e9',
            url: '/iot/notice/Template',
            icon: 'icon-tongzhiguanli',
            sortIndex: 2,
            showPage: ['template'],
            permissions: [
              {
                permission: 'template',
                actions: ['query'],
              },
              {
                permission: 'notifier',
                actions: ['query', 'send'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'log',
                name: $t('data.baseMenu.633486-9'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'debug',
                name: $t('data.baseMenu.633486-10'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'send'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'add',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: $t('data.baseMenu.633486-11'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: $t('data.baseMenu.633486-12'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['save'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            assetType: 'notifyTemplate',
            supportDataAccess: true
          },
        ],
      },
      {
        code: 'device',
        name: $t('data.baseMenu.633486-18'),
        owner: 'iot',
        //parentId: '1',
        id: 'b6327c3ff01b49c9a7a96101606dc27a',
        url: '/iot/device',
        icon: 'icon-shebei',
        sortIndex: 3,
        permissions: [],
        showPage: [],
        children: [
          {
            code: 'device/DashBoard',
            name: $t('data.baseMenu.633486-19'),
            owner: 'iot',
            //parentId: '1-3',
            id: '68a02c9efa9fb4885c89b007f97d074d',
            url: '/iot/device/DashBoard',
            icon: 'icon-keshihua',
            sortIndex: 1,
            showPage: ['dashboard', 'device-product', 'device-instance'],
            permissions: [
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'dashboard',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'geo-manager',
                actions: ['find-geo'],
              },
              {
                permission: 'system_config',
                actions: ['query'],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'device/Product',
            name: $t('data.baseMenu.633486-20'),
            owner: 'iot',
            //parentId: '1-3',
            id: '8ddbb67de5f65514105d47b448bfd70e',
            url: '/iot/device/Product',
            icon: 'icon-chanpin',
            sortIndex: 2,
            assetType: 'product',
            showPage: ['device-product'],
            permissions: [
              {
                permission: 'transparent-codec',
                actions: ['query', 'save'],
              },
              {
                permission: 'network-config',
                actions: ['query'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-category',
                actions: ['query'],
              },
              {
                permission: 'device-mapping',
                actions: ['query', 'save'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-mapping',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: $t('data.baseMenu.633486-11'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: $t('data.baseMenu.633486-12'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['delete'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true
          },
          {
            code: 'device/Instance',
            name: $t('data.baseMenu.633486-22'),
            owner: 'iot',
            //parentId: '1-3',
            id: '1b136e7e4e4e74bb24b91802e4cfcd2d',
            url: '/iot/device/Instance',
            icon: 'icon-shebei',
            sortIndex: 3,
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'device',
            showPage: ['device-instance'],
            permissions: [
              {
                permission: 'transparent-codec',
                actions: ['query'],
              },
              {
                permission: 'protocol-supports',
                actions: ['query'],
              },
              {
                permission: 'device-api',
                actions: ['query-device-events'],
              },
              {
                permission: 'things-collector',
                actions: ['save', 'delete'],
              },
              {
                permission: 'edge-operations',
                actions: ['invoke'],
              },
              {
                permission: 'device-gateway',
                actions: ['query'],
              },
              {
                permission: 'system_config',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: $t('data.baseMenu.633486-11'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'export'],
                  },
                ],
              },
              {
                id: 'import',
                name: $t('data.baseMenu.633486-12'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['import', 'query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'visualization',
                    actions: ['query'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-opt-api',
                    actions: ['read-property', 'invoke-function', 'write-property'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'dictionary',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-category',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-mapping',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'media-server',
                    actions: ['query'],
                  },
                  {
                    permission: 'dashboard',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['enable', 'disable', 'query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'device/Category',
            name: $t('data.baseMenu.633486-23'),
            owner: 'iot',
            //parentId: '1-3',
            id: 'bc83f18659982abb9ac1a96362fc3372',
            sortIndex: 4,
            url: '/iot/device/Category',
            icon: 'icon-chanpinfenlei',
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'deviceCategory',
            showPage: ['device-category'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'link',
        name: $t('data.baseMenu.633486-24'),
        owner: 'iot',
        //parentId: '1',
        id: 'bd55cdc9d0c1700afe628f572f91c22e',
        url: '/iot/link',
        icon: 'icon-yunweiguanli-1',
        permissions: [],
        sortIndex: 4,
        children: [
          {
            code: 'link/DashBoard',
            name: $t('data.baseMenu.633486-19'),
            owner: 'iot',
            //parentId: '1-4',
            id: '47bedff9df89ecc0f0ce896e53805f02',
            sortIndex: 1,
            url: '/iot/link/dashboard',
            icon: 'icon-keshihua',
            showPage: ['dashboard', 'network-config'],
            permissions: [
              {
                permission: 'network-config',
                actions: ['query'],
              },
              {
                permission: 'dashboard',
                actions: ['query'],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'link/AccessConfig',
            name: $t('data.baseMenu.633486-25'),
            owner: 'iot',
            //parentId: '1-4',
            id: '10e67b761ec1f4206fabf36fcf9d9b0b',
            sortIndex: 2,
            url: '/iot/link/accessConfig',
            icon: 'icon-wangguanzishebei',
            showPage: ['device-gateway'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-point',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'opc-client',
                    actions: ['query', 'save', 'delete'],
                  },
                  {
                    permission: 'opc-device-bind',
                    actions: ['query', 'save', 'delete'],
                  },
                  {
                    permission: 'gb28181-cascade',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-point',
                    actions: ['query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'media-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'opc-client',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-device-bind',
                    actions: ['query'],
                  },
                  {
                    permission: 'gb28181-cascade',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'link/Protocol',
            name: $t('data.baseMenu.633486-26'),
            owner: 'iot',
            //parentId: '1-4',
            id: 'cdd73c8cb02d1ae9af61ded7fc31e9c5',
            sortIndex: 3,
            url: '/iot/link/protocol',
            icon: 'icon-tongzhiguanli',
            showPage: ['protocol-supports'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'Log',
            name: $t('data.baseMenu.633486-27'),
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
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'link/Type',
            name: $t('data.baseMenu.633486-28'),
            owner: 'iot',
            //parentId: '1-4',
            id: 'f99acd0b64f96209eb276236cfb427cb',
            sortIndex: 5,
            url: '/iot/link/type',
            icon: 'icon-wangluozujian',
            showPage: ['network-config'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save', 'action'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'link/Certificate',
            name: $t('data.baseMenu.633486-29'),
            owner: 'iot',
            //parentId: '1-4',
            id: 'e395655a273a1b765236342738289587',
            sortIndex: 6,
            url: '/iot/link/Certificate',
            icon: 'icon-zhengshuguanli',
            showPage: ['certificate'],
            permissions: [],
            buttons: [
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'media/Stream',
            name: $t('data.baseMenu.633486-30'),
            owner: 'iot',
            //parentId: '1-4',
            id: '82fd382e97bc132aa1a6cc926d804d48',
            sortIndex: 7,
            url: '/iot/link/Stream',
            icon: 'icon-xuanzetongdao1',
            showPage: ['media-server'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'device/Firmware',
            name: $t('data.baseMenu.633486-31'),
            owner: 'iot',
            //parentId: '1-4',
            id: 'e0943d4c2fa539e89df1ff92e3379477',
            sortIndex: 9,
            url: '/iot/link/firmware',
            icon: 'icon-yuanchengshengji',
            showPage: ['firmware-manager'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-manager',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query', 'save', 'deploy'],
                  },
                  {
                    permission: 'firmware-manager',
                    actions: ['query'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query', 'save', 'deploy'],
                  },
                ],
              },

            ],
            accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
            supportDataAccess: false,
            indirectMenus: ['8ddbb67de5f65514105d47b448bfd70e']
          },
          {
            code: 'link/plugin',
            name: $t('data.baseMenu.633486-33'),
            owner: 'iot',
            //parentId: '1-4',
            id: 'a20354876e9519e48f5ed6710ba6efb3',
            sortIndex: 10,
            url: '/iot/link/plugin',
            icon: 'BoxPlotOutlined',
            showPage: ['plugin-driver'],
            permissions: [
              {
                permission: 'plugin-driver',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'plugin-driver',
                    actions: ['view'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'plugin-driver',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'plugin-driver',
                    actions: ['delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'plugin-driver',
                    actions: ['save'],
                  },
                ],
              },

            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false,
          },
        ],
      },
      {
        code: 'link/DataCollect',
        name: $t('data.baseMenu.633486-34'),
        id: '3e5a9473e284803134b3f63c086d7385',
        owner: 'iot',
        sortIndex: 10,
        url: '/iot/link/DataCollect',
        icon: 'icon-analytics',
        showPage: [],
        permissions: [],
        children: [
          {
            code: 'DataCollect/Dashboard',
            name: $t('data.baseMenu.633486-19'),
            owner: 'iot',
            sortIndex: 1,
            id: '802c1d835cd9f687ffb2092b593fb1b8',
            url: '/iot/DataCollect/Dashboard',
            icon: 'icon-keshihua',
            showPage: [
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [
              { permission: 'dashboard', actions: ['query'] },
              { permission: 'data-collect-channel', actions: ['query'] },
              { permission: 'data-collect-opc', actions: ['query'] },
              { permission: 'data-collector', actions: ['query'] },
              { permission: 'things-collector', actions: ['query'] },
            ],
            buttons: [],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'DataCollect/Channel',
            name: $t('data.baseMenu.633486-35'),
            owner: 'iot',
            id: 'e867ee3d31a7b963d38f40a3b51d0191',
            sortIndex: 2,
            url: '/iot/DataCollect/Channel',
            icon: 'icon-rizhifuwu',
            showPage: [
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-36'),
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['delete', 'query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'dataCollectChannel'
          },
          {
            code: 'DataCollect/Collector',
            name: $t('data.baseMenu.633486-37'),
            owner: 'iot',
            id: 'f97141d2737ebc3e3ab2cda4a38e8c79',
            sortIndex: 3,
            url: '/iot/DataCollect/Collector',
            icon: 'icon-yingyongguanli',
            showPage: [
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [],
            buttons: [
              {
                "id": "view",
                "name": $t('data.baseMenu.633486-2'),
                "permissions": [
                  {
                    "permission": "data-collect-channel",
                    "actions": [
                      "query"
                    ]
                  },
                  {
                    "permission": "data-collector",
                    "actions": [
                      "query"
                    ]
                  },
                  {
                    "permission": "data-collect-opc",
                    "actions": [
                      "query"
                    ]
                  },
                  {
                    "permission": "things-collector",
                    "actions": [
                      "query"
                    ]
                  },
                  {
                    "permission": "s7-client",
                    "actions": [
                      "query"
                    ]
                  }
                ]
              },
              {
                "id": "add",
                "name": $t('data.baseMenu.633486-15'),
                "permissions": [
                  {
                    "permission": "data-collect-channel",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collect-opc",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "things-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "s7-client",
                    "actions": [
                      "query"
                    ]
                  }
                ]
              },
              {
                "id": "update",
                "name": $t('data.baseMenu.633486-14'),
                "permissions": [
                  {
                    "permission": "data-collect-channel",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collect-opc",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "things-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "certificate",
                    "actions": [
                      "query"
                    ]
                  },
                  {
                    "permission": "s7-client",
                    "actions": [
                      "query"
                    ]
                  }
                ]
              },
              {
                "id": "action",
                "name": $t('data.baseMenu.633486-36'),
                "permissions": [
                  {
                    "permission": "data-collect-channel",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "data-collect-opc",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "things-collector",
                    "actions": [
                      "query",
                      "save"
                    ]
                  },
                  {
                    "permission": "s7-client",
                    "actions": []
                  }
                ]
              },
              {
                "id": "delete",
                "name": $t('data.baseMenu.633486-13'),
                "permissions": [
                  {
                    "permission": "data-collect-channel",
                    "actions": [
                      "query",
                      "delete"
                    ]
                  },
                  {
                    "permission": "data-collector",
                    "actions": [
                      "query",
                      "delete"
                    ]
                  },
                  {
                    "permission": "data-collect-opc",
                    "actions": [
                      "query",
                      "delete"
                    ]
                  },
                  {
                    "permission": "things-collector",
                    "actions": [
                      "query",
                      "delete"
                    ]
                  }
                ]
              }
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'dataCollectCollector'
          },
        ],
      },
      {
        code: 'rule-engine/Alarm',
        name: $t('data.baseMenu.633486-38'),
        owner: 'iot',
        //parentId: '1',
        id: '3c7dca6ea8b5828bbcc023ce905244f7',
        sortIndex: 5,
        url: '/iot/Alarm',
        icon: 'icon-shebeigaojing',
        permissions: [],
        buttons: [],
        showPage: [],
        children: [
          {
            code: 'rule-engine/DashBoard',
            name: $t('data.baseMenu.633486-19'),
            owner: 'iot',
            //parentId: '1-5',
            id: 'f4d6880e3d8b3e3234c547fa84856b32',
            sortIndex: 1,
            url: '/iot/Alarm/dashboard',
            icon: 'icon-keshihua',
            showPage: ['dashboard', 'alarm-record', 'alarm-config'],
            permissions: [
              { permission: 'dashboard', actions: ['query'] },
              { permission: 'alarm-config', actions: ['query'] },
              { permission: 'alarm-record', actions: ['query'] },
            ],
            buttons: [],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'rule-engine/Alarm/Config',
            name: $t('data.baseMenu.633486-39'),
            owner: 'iot',
            //parentId: '1-5',
            id: 'af160284d1934bf052a2eeb9b9a9cb8f',
            sortIndex: 2,
            url: '/iot/Alarm/Config',
            icon: 'icon-chajianguanli',
            showPage: ['alarm-config'],
            permissions: [],
            buttons: [
              {
                id: 'update',
                name: $t('data.baseMenu.633486-40'),
                permissions: [
                  // { permission: 'alarm-record', actions: ['query', 'save'] },
                  { permission: 'alarm-config', actions: ['query', 'save'] },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
          {
            code: 'rule-engine/Alarm/Configuration',
            name: $t('data.baseMenu.633486-41'),
            owner: 'iot',
            //parentId: '1-5',
            id: 'c5d3b1261f2f414dd04b0bf9194aa29e',
            sortIndex: 3,
            url: '/iot/Alarm/Configuration',
            icon: 'icon-warning_amber',
            showPage: ['alarm-config'],
            permissions: [
              {
                permission: 'organization',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'alarm-record',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-record',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save', 'delete'],
                  },
                ],
              },
              {
                id: 'tigger',
                name: $t('data.baseMenu.633486-42'),
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'alarmConfig'
          },
          {
            code: 'rule-engine/Alarm/Log',
            name: $t('data.baseMenu.633486-43'),
            owner: 'iot',
            //parentId: '1-5',
            id: 'fca24d8d3276a410f7031a9b721017fd',
            sortIndex: 4,
            url: '/iot/Alarm/Log',
            icon: 'icon-changjingliandong',
            showPage: ['alarm-record'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'alarm-record',
                    actions: ['query'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-44'),
                permissions: [
                  {
                    permission: 'alarm-record',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
            supportDataAccess: false
          },
        ],
      },
      {
        code: 'Northbound',
        name: $t('data.baseMenu.633486-45'),
        owner: 'iot',
        //parentId: '1',
        id: 'ea3d760edbd908eb0bc901db2801e8b5',
        sortIndex: 6,
        url: '/iot/northbound',
        icon: 'icon-yunyunjieru',
        permissions: [],
        buttons: [],
        showPage: [],
        children: [
          {
            code: 'Northbound/DuerOS',
            name: 'DuerOS',
            owner: 'iot',
            //parentId: '1-6',
            id: '4a7c3fbac5a3a894e90d0e9e4a3e4aa5',
            sortIndex: 1,
            url: '/iot/northbound/DuerOS',
            icon: 'icon-zhineng',
            permissions: [],
            showPage: ['dueros-product'],
            buttons: [
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'dueros'
          },
          {
            code: 'Northbound/AliCloud',
            name: $t('data.baseMenu.633486-46'),
            owner: 'iot',
            //parentId: '1-6',
            id: '2b808202bfc9159838d3be675e63719f',
            sortIndex: 2,
            url: '/iot/northbound/AliCloud',
            icon: 'icon-aliyun',
            permissions: [],
            showPage: ['aliyun-bridge'],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-47'),
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'aliyunNorthOutput'
          },
        ],
      },
      {
        code: 'rule-engine',
        name: $t('data.baseMenu.633486-48'),
        owner: 'iot',
        //parentId: '1',
        id: '91aa7c753b1c030dfad612aa0a45d453',
        sortIndex: 7,
        url: '/iot/rule-engine',
        icon: 'icon-zidingyiguize',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'rule-engine/Instance',
            name: $t('data.baseMenu.633486-49'),
            owner: 'iot',
            //parentId: '1-7',
            id: '898001f2efa11f93253d67a254904ead',
            sortIndex: 1,
            url: '/iot/rule-engine/Instance',
            icon: 'icon-changjingliandong',
            showPage: ['rule-instance'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['stop', 'query', 'start', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'ruleInstance'
          },
          {
            code: 'rule-engine/Scene',
            name: $t('data.baseMenu.633486-50'),
            owner: 'iot',
            //parentId: '1-7',
            id: 'b68867fdc24cfc3df7c52e842136f439',
            sortIndex: 2,
            url: '/iot/rule-engine/scene',
            icon: 'icon-yunweiguanli-1',
            showPage: ['rule-scene'],
            permissions: [],
            buttons: [
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'delete'],
                  },
                  // {
                  //   permission: 'alarm-config',
                  //   actions: ['query'],
                  // },
                ],
              },
              {
                id: 'tigger',
                name: $t('data.baseMenu.633486-42'),
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
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
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                  {
                    permission: 'relation',
                    actions: ['query'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-47'),
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
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
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'relation',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
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
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'relation',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
            supportDataAccess: true,
            assetType: 'scene'
          },
        ],
      },
      {
        code: 'edge',
        name: $t('data.baseMenu.633486-51'),
        owner: 'iot',
        id: 'cc29671ed5ef8d6df951b2fc523f36ca',
        sortIndex: 8,
        url: '/iot/edge',
        icon: 'icon-bianyuanwangguan',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'edge/Device',
            name: $t('data.baseMenu.633486-52'),
            owner: 'iot',
            id: 'c9f2530273ec057e3a5674faf3c6c073',
            sortIndex: 1,
            url: '/iot/edge/Devic',
            icon: 'icon-bumenguanli',
            showPage: ['edge-operations'],
            permissions: [
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['enable', 'disable'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'add',
                name: $t('data.baseMenu.633486-15'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'import',
                name: $t('data.baseMenu.633486-12'),
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'setting',
                name: $t('data.baseMenu.633486-53'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['save'],
                  },
                  {
                    permission: 'edge-operations',
                    actions: ['remote'],
                  },
                ],
              },
              {
                id: 'password',
                name: $t('data.baseMenu.633486-54'),
                permissions: [
                  {
                    permission: 'edge-operations',
                    actions: ['invoke'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
            supportDataAccess: false,
            indirectMenus: ['1b136e7e4e4e74bb24b91802e4cfcd2d']
          },
          {
            code: 'edge/Resource',
            name: $t('data.baseMenu.633486-55'),
            owner: 'iot',
            id: '7f49fcece2b291aa595a0ace3ea43ca1',
            sortIndex: 2,
            url: '/iot/edge/Resource',
            icon: 'icon-Vector',
            showPage: ['edge-operations'],
            permissions: [
              {
                permission: 'entity-template',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: $t('data.baseMenu.633486-2'),
                permissions: [
                  {
                    permission: 'entity-template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: $t('data.baseMenu.633486-21'),
                permissions: [
                  {
                    permission: 'entity-template',
                    actions: ['enable', 'disable'],
                  },
                ],
              },
              {
                id: 'delete',
                name: $t('data.baseMenu.633486-13'),
                permissions: [
                  {
                    permission: 'entity-template',
                    actions: ['delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: $t('data.baseMenu.633486-14'),
                permissions: [
                  {
                    permission: 'entity-template',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'setting',
                name: $t('data.baseMenu.633486-56'),
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'edge-operations',
                    actions: ['invoke'],
                  },
                  {
                    permission: 'entity-template',
                    actions: ['query'],
                  },
                ],
              },
            ],
            accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
            supportDataAccess: false
          },
        ],
      },
    ],
  },

  // 视频中心
  {
    code: 'media',
    name: $t('data.baseMenu.633486-57'),
    owner: 'iot',
    id: 'a0ca3cb1035b1484e04344f85a688d71',
    url: '/media',
    icon: 'icon-shipinwangguan',
    sortIndex: 2,
    permissions: [],
    buttons: [],
    children: [
      {
        code: 'media/Home',
        name: $t('data.baseMenu.633486-5'),
        owner: 'iot',
        //parentId: '2',
        id: 'a7693e3ccb4144fc66c4b6b7a716576b',
        sortIndex: 1,
        url: '/media/home',
        icon: 'icon-zhihuishequ',
        permissions: [],
        buttons: [],
        showPage: ['media-device'],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'media/DashBoard',
        name: $t('data.baseMenu.633486-19'),
        owner: 'iot',
        //parentId: '2',
        id: 'cc989fbfa0cd7f70f6a1154c89f2b9a4',
        sortIndex: 2,
        url: '/media/dashboard',
        icon: 'icon-keshihua',
        permissions: [
          {
            permission: 'media-device',
            actions: ['query'],
          },
        ],
        buttons: [],
        showPage: ['media-device'],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'media/Device',
        name: $t('data.baseMenu.633486-58'),
        owner: 'iot',
        //parentId: '2',
        id: 'c4d640af0a00ce619a429e7d1c2d2bb8',
        sortIndex: 3,
        url: '/media/device',
        icon: 'icon-shipinwangguan',
        showPage: ['media-device'],
        permissions: [
          {
            permission: 'media-gateway',
            actions: ['enable', 'disable', 'query', 'save', 'delete'],
          },
          {
            permission: 'file',
            actions: ['upload-static'],
          },
          {
            permission: 'media-record',
            actions: ['record', 'query', 'sync'],
          },
          {
            permission: 'media-channel',
            actions: ['query'],
          },
          {
            permission: 'device-gateway',
            actions: ['query', 'save', 'delete'],
          },
          {
            permission: 'gb28181-cascade',
            actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
          },
          {
            permission: 'device-product',
            actions: ['query', 'save', 'delete'],
          },
          {
            permission: 'media-device',
            actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'media-device',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'media-device',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'device-gateway',
                actions: ['query'],
              },
              {
                permission: 'media-device',
                actions: ['stop', 'ptz', 'record', 'query', 'start', 'save'],
              },
              {
                permission: 'media-channel',
                actions: ['query', 'save'],
              },
              {
                permission: 'gb28181-cascade',
                actions: ['bind', 'unbind', 'query', 'save'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            description: '',
            permissions: [
              {
                permission: 'media-device',
                actions: ['query', 'save'],
              },
              {
                permission: 'device-gateway',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
        supportDataAccess: false,
        indirectMenus: ['1b136e7e4e4e74bb24b91802e4cfcd2d']
      },
      {
        code: 'media/SplitScreen',
        name: $t('data.baseMenu.633486-59'),
        owner: 'iot',
        //parentId: '2',
        id: '33ad7bae1dcb991bfe434d62fb2c72ba',
        sortIndex: 4,
        url: '/media/SplitScreen',
        icon: 'icon-fenpingzhanshi1',
        showPage: ['media-device'],
        permissions: [
          {
            permission: 'media-channel',
            actions: ['query'],
          },
          {
            permission: 'media-device',
            actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            description: '',
            permissions: [
              {
                permission: 'media-device',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
        supportDataAccess: false,
        indirectMenus: ['c4d640af0a00ce619a429e7d1c2d2bb8']
      },
      {
        code: 'media/Cascade',
        name: $t('data.baseMenu.633486-60'),
        owner: 'iot',
        //parentId: '2',
        id: '1e00baa93418f820671f24ed45db59ae',
        sortIndex: 5,
        url: '/media/Cascade',
        icon: 'icon-guojijilian',
        showPage: ['gb28181-cascade'],
        permissions: [
          {
            permission: 'gb28181-cascade',
            actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'gb28181-cascade',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'gb28181-cascade',
                actions: ['enable', 'disable', 'query', 'save'],
              },
            ],
          },
          {
            id: 'push',
            name: $t('data.baseMenu.633486-61'),
            permissions: [
              {
                permission: 'media-channel',
                actions: ['query'],
              },
              {
                permission: 'gb28181-cascade',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'channel',
            name: $t('data.baseMenu.633486-62'),
            permissions: [
              {
                permission: 'media-device',
                actions: ['query'],
              },
              {
                permission: 'media-channel',
                actions: ['query'],
              },
              {
                permission: 'gb28181-cascade',
                actions: ['bind', 'unbind', 'query', 'save'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'gb28181-cascade',
                actions: ['delete'],
              },
              {
                permission: 'media-server',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'gb28181-cascade',
                actions: ['query', 'save'],
              },
              {
                permission: 'media-server',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'gb28181-cascade',
                actions: ['query', 'save'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'gbCascade'
      },
    ],
  },
  {
    path: '5Hpl',
    id: '76d77b275aa60553e9ea1cb40677e9c2',
    sortIndex: 3,
    level: 1,
    owner: 'iot',
    name: $t('data.baseMenu.633486-63'),
    code: 'iot-card',
    url: '/iot-card',
    icon: 'icon-wulianka',
    permissions: [],
    children: [
      {
        path: '5Hpl-mghg',
        sortIndex: 1,
        level: 1,
        id: '899d4880929c3a8fc02068351f55316b',
        owner: 'iot',
        name: $t('data.baseMenu.633486-5'),
        code: 'iot-card/Home',
        url: '/iot-card/Home',
        icon: 'icon-zhihuishequ',
        status: 1,
        showPage: ['network-flow', 'network-card'],
        permissions: [
          {
            permission: 'network-flow',
            actions: ['query'],
          },
          {
            permission: 'network-card',
            actions: ['query'],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
        supportDataAccess: false,
        indirectMenus: ['1deaa9efc0fc37a8e8e81fa9d6540bc3']
      },
      {
        path: '5Hpl-4VFS',
        sortIndex: 2,
        level: 1,
        id: 'f2ea1793896fa5ecc816e975e07d4edb',
        owner: 'iot',
        name: $t('data.baseMenu.633486-19'),
        code: 'iot-card/Dashboard',
        url: '/iot-card/Dashboard',
        icon: 'icon-keshihua',
        showPage: ['network-flow'],
        permissions: [{ permission: 'network-flow', actions: ['query'] }],
        accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
        supportDataAccess: false,
        indirectMenus: ['1deaa9efc0fc37a8e8e81fa9d6540bc3']
      },
      {
        path: '5Hpl-O2m8',
        sortIndex: 3,
        level: 2,
        id: '1deaa9efc0fc37a8e8e81fa9d6540bc3',
        owner: 'iot',
        name: $t('data.baseMenu.633486-64'),
        code: 'iot-card/CardManagement',
        url: '/iot-card/CardManagement',
        icon: 'icon-wuliankaguanli',
        status: 1,
        showPage: ['network-card'],
        permissions: [
          {
            permission: 'platform',
            actions: ['query'],
          },
          {
            permission: 'network-card',
            actions: ['query'],
          },
          {
            permission: 'network-flow',
            actions: ['query'],
          },
        ],
        buttons: [
          {
            id: 'sync',
            name: $t('data.baseMenu.633486-65'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['sync'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'import',
            name: $t('data.baseMenu.633486-12'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['import'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'export',
            name: $t('data.baseMenu.633486-11'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['export'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['delete'],
              },
              {
                permission: 'network-card',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'active',
            name: $t('data.baseMenu.633486-66'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['active'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'bind',
            name: $t('data.baseMenu.633486-67'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['action'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'action',
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
              {
                permission: 'network-card',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'networkCard'
      },
      {
        path: '5Hpl-ZjAG',
        sortIndex: 4,
        level: 2,
        id: 'e332ab7c3837fe08b86a6e4f16dd1dcc',
        owner: 'iot',
        name: $t('data.baseMenu.633486-68'),
        showPage: ['network-card'],
        code: 'iot-card/Recharge',
        url: '/iot-card/Recharge',
        icon: 'icon-chongzhiguanli',
        status: 1,
        permissions: [
          {
            permission: 'network-card',
            actions: ['query', 'save'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'network-card',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'pay',
            name: $t('data.baseMenu.633486-69'),
            permissions: [
              {
                permission: 'network-card',
                actions: ['query', 'save'],
              },
              {
                permission: 'platform',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-32'), value: "indirect" },
        supportDataAccess: false,
        indirectMenus: ['febd4c4b452ece6bb1d760c25b37b75f']
      },
      {
        path: '5Hpl-eS9h',
        sortIndex: 5,
        level: 2,
        id: 'febd4c4b452ece6bb1d760c25b37b75f',
        owner: 'iot',
        name: $t('data.baseMenu.633486-70'),
        code: 'iot-card/Platform',
        url: '/iot-card/Platform',
        icon: 'icon-pingtaiduijie',
        status: 1,
        showPage: ['platform'],
        permissions: [
          {
            permission: 'platform',
            actions: ['query'],
          },
        ],
        buttons: [
          {
            id: 'action',
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'platform',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'platform',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'networkCardPlatform'
      },
      {
        path: '5Hpl-cL34',
        sortIndex: 6,
        level: 1,
        id: 'c4dfe00c4d7ecfd327eaeb278546502e',
        owner: 'iot',
        name: $t('data.baseMenu.633486-71'),
        code: 'iot-card/Record',
        url: '/iot-card/Record',
        icon: 'icon-tongzhijilu',
        status: 1,
        showPage: ['network-card'],
        permissions: [
          {
            permission: 'network-card',
            actions: ['query'],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
    ],
  },
  // 系统管理
  {
    code: 'system',
    name: $t('data.baseMenu.633486-72'),
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
        name: $t('data.baseMenu.633486-39'),
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
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'system_config',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-40'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/User',
        name: $t('data.baseMenu.633486-73'),
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
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'user',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'save', 'update-self-info'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-15'),
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
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'user'
      },
      {
        code: 'system/Department',
        name: $t('data.baseMenu.633486-74'),
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
            name: $t('data.baseMenu.633486-2'),
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
            name: $t('data.baseMenu.633486-75'),
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
            name: $t('data.baseMenu.633486-76'),
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
            name: $t('data.baseMenu.633486-77'),
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
            name: $t('data.baseMenu.633486-13'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-15'),
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
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'organization'
      },
      {
        code: 'system/Role',
        name: $t('data.baseMenu.633486-78'),
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
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'role',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-2'),
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
            name: $t('data.baseMenu.633486-79'),
            permissions: [
              {
                permission: 'role-group',
                actions: ['query','save']
              }
            ],
          },
          {
            id: 'groupDelete',
            name: $t('data.baseMenu.633486-80'),
            permissions: [
              {
                permission: 'role-group',
                actions: ['query','delete']
              }
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'role'
      },
      {
        code: 'system/Menu',
        name: $t('data.baseMenu.633486-81'),
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
            name: $t('data.baseMenu.633486-2'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'menu',
                actions: ['query', 'grant', 'delete'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Permission',
        name: $t('data.baseMenu.633486-82'),
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
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'export',
            name: $t('data.baseMenu.633486-11'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'import',
            name: $t('data.baseMenu.633486-12'),
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
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save', 'grant'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save', 'grant'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Relationship',
        name: $t('data.baseMenu.633486-83'),
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
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'view',
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'relation',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'save'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/DataSource',
        name: $t('data.baseMenu.633486-84'),
        owner: 'iot',
        //parentId: '3',
        id: 'c62a6bd5018763dae9fc0d869b6df3a2',
        sortIndex: 8,
        url: '/system/DataSource',
        icon: 'icon-shebei',
        showPage: ['datasource-config'],
        permissions: [],
        buttons: [
          {
            id: 'manage',
            name: $t('data.baseMenu.633486-85'),
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
          {
            id: 'delete',
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'datasource-config',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'action',
            name: $t('data.baseMenu.633486-47'),
            permissions: [
              {
                permission: 'datasource-config',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'update',
            name: $t('data.baseMenu.633486-14'),
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-16'), value: "support" },
        supportDataAccess: true,
        assetType: 'datasource'
      },
      {
        code: 'system/Platforms/Setting',
        name: $t('data.baseMenu.633486-86'),
        owner: 'iot',
        //parentId: '3',
        id: '8750142230773cde42a4e28efa7f84d5',
        sortIndex: 9,
        url: '/system/Api',
        icon: 'icon-chakanAPI',
        showPage: ['open-api'],
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-2'),
            permissions: [
              {
                permission: 'open-api',
                actions: ['query'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Apply',
        name: $t('data.baseMenu.633486-87'),
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
            name: $t('data.baseMenu.633486-13'),
            permissions: [
              {
                permission: 'application',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'add',
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-2'),
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
            name: $t('data.baseMenu.633486-21'),
            permissions: [
              {
                permission: 'application',
                actions: ['save'],
              },
            ],
          },
        ],
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/NoticeRule',
        name: $t('data.baseMenu.633486-88'),
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
            name: $t('data.baseMenu.633486-13'),
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
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-21'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Dictionary',
        name: $t('data.baseMenu.633486-89'),
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
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-13'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-12'),
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
            name: $t('data.baseMenu.633486-90'),
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
            name: $t('data.baseMenu.633486-47'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Region',
        name: $t('data.baseMenu.633486-91'),
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
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-13'),
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
            name: $t('data.baseMenu.633486-14'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
      {
        code: 'system/Calendar',
        name: $t('data.baseMenu.633486-92'),
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
            name: $t('data.baseMenu.633486-15'),
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
            name: $t('data.baseMenu.633486-14'),
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
            name: $t('data.baseMenu.633486-13'),
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
        accessSupport: { text: $t('data.baseMenu.633486-0'), value: "unsupported" },
        supportDataAccess: false
      },
    ],
  },
  //物联卡

  {
    "path": "3n23",
    "sortIndex": 5,
    "level": 1,
    "owner": "iot",
    "name": "WEB IDE",
    "code": "web_ide",
    "url": "/web_ide",
    "icon": "MenuUnfoldOutlined",
    showPage: ["low-code-info", "low-code-editor"],
    "options": {
      isShow: false,
    },
    "accessSupport": {
      "text": $t('data.baseMenu.633486-0'),
      "value": "unsupported"
    },
    "indirectMenus": [],
    permissions: [
      {
        "permission": "low-code-info",
        "actions": [
          "add", "query", "save", "delete"
        ]
      },
      {
        "permission": "low-code-editor",
        "actions": [
          "query", "deploy"
        ]
      }
    ],
    "creatorId": "1199596756811550720",
    "createTime": 1698735482730,
    "supportDataAccess": false
  },
  {
    "path": "3nkE",
    "sortIndex": 6,
    "level": 1,
    "owner": "iot",
    "name": $t('data.baseMenu.633486-93'),
    "code": "process",
    "url": "/workflow",
    "icon": "MenuUnfoldOutlined",
    showPage: ["process-form","process-deployment", "process-runtime"],
    "options": {
      "show": true,
      "isShow": false
    },
    "permissions": [
      {
        "permission": "low-code-info",
        "actions": [
          "query"
        ]
      },
      {
        "permission": "process-runtime",
        "actions": [
          "transfer",
          "reject",
          "query",
          "start",
          "save",
          "self",
          "claim",
          "delete-ready",
          "complete",
          "createAndStart",
          "repeal"
        ]
      }
    ],
    "accessSupport": {
      "text": $t('data.baseMenu.633486-0'),
      "value": "unsupported"
    },
    "indirectMenus": [],
    "children": [
      // {
      //   "path": "3nkE-n7lJ",
      //   "sortIndex": 1,
      //   "level": 2,
      //   "name": "工作流",
      //   "code": "process/home",
      //   "describe": "",
      //   "url": "/workflow/home",
      //   "icon": "UpCircleOutlined",
      //   showPage: ["process-form"],
      //   "permissions": [
      //     {
      //       "permission": "process-form",
      //       "actions": [
      //         "query"
      //       ]
      //     },
      //     {
      //       "permission": "low-code-info",
      //       "actions": [
      //         "query"
      //       ]
      //     },
      //   ],
      //   "accessSupport": {
      //     "text": $t('data.baseMenu.633486-0'),
      //     "value": "unsupported"
      //   },
      //   "indirectMenus": [],
      //   "buttons": [],
      //   "options": {
      //     "show": true
      //   },
      //   "creatorId": "1199596756811550720",
      //   "createTime": 1699263818795,
      //   "supportDataAccess": false
      // },
      {
        "path": "3nkE-n7lJ",
        "sortIndex": 2,
        "level": 2,
        "name": $t('data.baseMenu.633486-94'),
        "code": "process/form",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/form",
        "icon": "UpCircleOutlined",
        showPage: ["process-form"],
        "permissions": [
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "buttons": [
          {
            "id": "add",
            "name": $t('data.baseMenu.633486-15'),
            "permissions": [
              {
                "permission": "process-form",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "save",
            "name": $t('data.baseMenu.633486-40'),
            "permissions": [
              {
                "permission": "process-form",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "update",
            "name": $t('data.baseMenu.633486-14'),
            "permissions": [
              {
                "permission": "process-form",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "delete",
            "name": $t('data.baseMenu.633486-13'),
            "permissions": [
              {
                "permission": "process-form",
                "actions": [
                  "delete"
                ]
              }
            ]
          }
        ],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699263818795,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-ysKb",
        "sortIndex": 3,
        "level": 2,
        "name": $t('data.baseMenu.633486-95'),
        "code": "process/model",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/model",
        "icon": "UpCircleOutlined",
        showPage: ["process-definition"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "buttons": [
          {
            "id": "add",
            "name": $t('data.baseMenu.633486-15'),
            "permissions": [
              {
                "permission": "process-definition",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "delete",
            "name": $t('data.baseMenu.633486-13'),
            "permissions": [
              {
                "permission": "process-definition",
                "actions": [
                  "delete"
                ]
              }
            ]
          },
          {
            "id": "update",
            "name": $t('data.baseMenu.633486-14'),
            "permissions": [
              {
                "permission": "process-definition",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "save",
            "name": $t('data.baseMenu.633486-40'),
            "permissions": [
              {
                "permission": "process-definition",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "deploy",
            "name": $t('data.baseMenu.633486-96'),
            "permissions": [
              {
                "permission": "process-definition",
                "actions": [
                  "save"
                ]
              }
            ]
          }
        ],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699264341009,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-fJkR",
        "sortIndex": 4,
        "level": 2,
        "name": $t('data.baseMenu.633486-97'),
        "code": "process/instance",
        "describe": "",
        "owner": "iot",
        showPage: ["process-deployment"],
        "url": "/workflow/instance",
        "icon": "UpCircleOutlined",
        "status": 1,
        "permissions": [
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "buttons": [
          {
            "id": "action",
            "name": $t('data.baseMenu.633486-21'),
            "permissions": [
              {
                "permission": "process-deployment",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "auth",
            "name": $t('data.baseMenu.633486-98'),
            "permissions": [
              {
                "permission": "process-deployment",
                "actions": [
                  "save"
                ]
              }
            ]
          },
          {
            "id": "delete",
            "name": $t('data.baseMenu.633486-13'),
            "permissions": [
              {
                "permission": "process-deployment",
                "actions": [
                  "delete"
                ]
              }
            ]
          }
        ],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699264485954,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-i2nG",
        "sortIndex": 5,
        "level": 2,
        "name": $t('data.baseMenu.633486-99'),
        "code": "process/initiate",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/initiate",
        "icon": "UpOutlined",
        showPage: ["process-runtime"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-runtime",
            "actions": [
              "transfer",
              "reject",
              "query",
              "start",
              "save",
              "self",
              "claim",
              "delete-ready",
              "complete",
              "createAndStart",
              "repeal"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699269393605,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-4T1D",
        "sortIndex": 6,
        "level": 2,
        "name": $t('data.baseMenu.633486-100'),
        "code": "process/me/todo",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/me/todo",
        "icon": "UpCircleOutlined",
        showPage: ["process-runtime"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-runtime",
            "actions": [
              "transfer",
              "reject",
              "query",
              "start",
              "save",
              "self",
              "claim",
              "delete-ready",
              "complete",
              "createAndStart",
              "repeal"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699269425041,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-RXP3",
        "sortIndex": 7,
        "level": 2,
        "name": $t('data.baseMenu.633486-101'),
        "code": "process/me/finished",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/me/finished",
        "icon": "UpCircleOutlined",
        showPage: ["process-runtime"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-runtime",
            "actions": [
              "transfer",
              "reject",
              "query",
              "start",
              "save",
              "self",
              "claim",
              "delete-ready",
              "complete",
              "createAndStart",
              "repeal"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699269455412,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-ibau",
        "sortIndex": 8,
        "level": 2,
        "name": $t('data.baseMenu.633486-102'),
        "code": "process/me/initiate",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/me/initiate",
        "icon": "UpCircleOutlined",
        showPage: ["process-runtime"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-runtime",
            "actions": [
              "transfer",
              "reject",
              "query",
              "start",
              "save",
              "self",
              "claim",
              "delete-ready",
              "complete",
              "createAndStart",
              "repeal"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699269488928,
        "supportDataAccess": false
      },
      {
        "path": "3nkE-vCQb",
        "sortIndex": 9,
        "level": 2,
        "name": $t('data.baseMenu.633486-103'),
        "code": "process/me/cc",
        "describe": "",
        "owner": "iot",
        "url": "/workflow/me/cc",
        "icon": "BorderInnerOutlined",
        "status": 1,
        showPage: ["process-runtime"],
        "permissions": [
          {
            "permission": "process-definition",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-runtime",
            "actions": [
              "transfer",
              "reject",
              "query",
              "start",
              "save",
              "self",
              "claim",
              "delete-ready",
              "complete",
              "createAndStart",
              "repeal"
            ]
          },
          {
            "permission": "process-deployment",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "process-form",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "role-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-third-party-manager",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "user-token",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-category",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "edge-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dueros-product",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-gateway",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-msg-task",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-group",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "opc-point",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "device-mapping",
            "actions": [
              "query"
            ]
          },
          {
            "permission": "dictionary",
            "actions": [
              "query"
            ]
          }
        ],
        "accessSupport": {
          "text": $t('data.baseMenu.633486-0'),
          "value": "unsupported"
        },
        "indirectMenus": [],
        "options": {
          "show": true
        },
        "creatorId": "1199596756811550720",
        "createTime": 1699348851779,
        "supportDataAccess": false
      }
    ],
    "creatorId": "8004214f8141f29cb951befdca3615f0",
    "createTime": 1699262480040,
    "supportDataAccess": false
  }
];
