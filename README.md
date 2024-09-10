<h1 align="center"> JetLinks-ui-vue</h1>

## 平台简介

* 本仓库为JetLinks vue版本。
* 前端技术栈[Vue3](https://v3.cn.vuejs.org) + [Jetlinks-ui-components](https://github.com/jetlinks/jetlinks-ui-components) + [Vite 4.x](https://cn.vitejs.dev)
* 本项目采用约定式路由，文件系统即路由，通过目录和文件及其命名分析出路由配置。

## 前端运行
```bash
# 克隆项目
git clone https://github.com/jetlinks/jetlinks-ui-vue.git

# 安装依赖
yarn

# 启动服务
yarn dev

# 更新jetlinks-ui-components
yarn add jetlinks-ui-components@latest

# 更新jetlinks-ui-components之后没有效果时
yarn dev:force

```
## Node
* node >= 18.14.0

## 浏览器兼容
* Chrome >= 100
* Firefox >= 100
* Edge >= 100  
不支持IE

### 备注

* 项目在开发模式下，首页加载慢属于正常现象；
* 打开F12后页面卡顿是`vuetools`引起，[https://github.com/vuejs/devtools/issues/1987](https://github.com/vuejs/devtools/issues/1987)

## 更改配置

### 默认图标以及系统名称

#### 1.基础配置

首先启动项目，找到顶部菜单的 系统管理 -> 基础配置

此处可以更改系统名称、主题色、系统logo、浏览器页签等

#### 主题色

```javascript
// src/App.vue

ConfigProvider.config({
  theme: {
    primaryColor: "#315efb"
  }
})
```

#### 2.默认配置

在代码根目录找到`config\config.ts`文件

> 默认图标以及系统名称优先使用基础配置的数据！

```javascript
export default {
  ...
  logo: '/favicon.ico', // 浏览器标签页logo(不要修改，如需修改默认图标请在根目录public\favicon.ico替换此文件)
  title: 'Jetlinks', // 浏览器标签页title(刷新状态时浏览器标签页名称)
  layout: {
    title: '物联网平台', // 平台title(默认配置不生效，优先使用基础配置的数据)
    logo: '/logo.png', // 平台logo(不要修改，如需修改默认logo请在根目录public\logo.png替换此文件)
    question: true // 控制显示右上角说明文档按钮显示影藏
    ...
  }
}
```

### 去掉或修改备案信息

#### 修改备案信息

在`src\views\user\Login\index.vue`文件

在第16行左右，修改以下代码`备案: xxx(自己的备案信息)`
```javascript
<a
    href="https://beian.miit.gov.cn/#/Integrated/index"
    target="_blank"
    rel="noopener noreferrer"
    class="records"
>
    备案: xxx(自己的备案信息)
</a>
```

### 去掉导航栏右上角jetlinks文档

在`src\components\Layout\BasicLayoutPage.vue`文件
在第23行左右，注释以下代码

```javascript
<!-- <AIcon type="QuestionCircleOutlined" @click="toDoc" /> -->
```

### 新增菜单

新增或者修改菜单有两种方式，第一个是代码内的初始化菜单，第二个系统管理的菜单管理

* 初始化菜单
初始化菜单是默认的菜单，在进行系统初始化会使用到。
> 在进行菜单初始化时，如果只在菜单管理新增或修改，但是没有在初始化菜单里新增或者修改，则只会保留初始化菜单！

* 菜单管理
菜单管理是 系统管理 -> 菜单管理 的菜单，可以动态修改，新增或者更改
> 如果需要系统初始化时不丢失，请在`src\views\init-home\data\baseMenu.ts`文件下新增或者修改初始化菜单


**新增或者修改菜单之前，确保`src\views`文件夹下有对应的文件夹以及index.vue入口文件**

#### 1.菜单管理

新建文件夹以及文件`src\views\test\Home\index.vue`

##### 新增顶部菜单 test菜单

1. 启动项目，找到顶部菜单的 系统管理 -> 菜单管理，点击菜单配置旁边的新增按钮。

2. 完成菜单图标、名称、编码、页面地址、权限配置等
> 编码是唯一的，必须和文件路径一致此处是顶级菜单编码填入: test
> 页面地址建议和文件路径保持一致: /test

3. 点击保存，刷新页面后生效

4. 按钮权限 顶级菜单没有页面可以不用添加按钮权限 

##### 新增子菜单

1. 在菜单管理 test菜单 新增子菜单

2. 完成菜单图标、名称、编码、页面地址、权限配置等
> 编码是唯一的，必须和文件路径一致此处是test菜单下的二级菜单编码填入: test/Home
> 页面地址建议和文件路径保持一致: /test/Home

4. 点击保存，刷新页面后生效

5. 按钮权限 如果有权限控制可以添加对应权限
 

#### 2.初始化菜单

建议在菜单管理新增或修改菜单之后，再来新增或修改初始化菜单

##### 新增顶部菜单test以及子菜单

**确定有对应的文件夹以及文件`src\views\test\Home\index.vue`**

1. 启动项目，找到顶部菜单的 系统管理 -> 菜单管理
 打开控制台(F12)，选中网络(Network)，点击菜单管理的搜索或者重置，直到有 tree 的接口请求。
 点击接口请求 tree , 并选中响应或者预览选项，找到刚刚新增code为test的数据，复制test菜单的数据

2. 在`src\views\init-home\data\baseMenu.ts`文件中添加配置

 把第一步test菜单的数据复制到对应位置即可

```javascript
export default [
    // 物联网
    ...
    // 视频中心
    ...
    // 系统管理
    ...
    // 物联卡
    ...

    // test菜单
    {
        "id": "eb2858ec8dc6d12645a19ee0ed6aba36",
        "parentId": "",
        "path": "FwY9",
        "sortIndex": 5,
        "level": 1,
        "owner": "iot",
        "name": "test菜单",
        "code": "test",
        "describe": "",
        "url": "/test",
        "icon": "StepForwardOutlined",
        "status": 1,
        "permissions": [],
        "accessSupport": {
            "text": "不支持",
            "value": "unsupported"
        },
        "indirectMenus": [],
        "children": [
            {
            "id": "1995dcd016aaad7c5515f8ead14ca617",
            "parentId": "eb2858ec8dc6d12645a19ee0ed6aba36",
            "path": "FwY9-T6lF",
            "sortIndex": 1,
            "level": 2,
            "owner": "iot",
            "name": "首页",
            "code": "test/Home",
            "describe": "",
            "url": "/test/Home",
            "icon": "HeatMapOutlined",
            "status": 1,
            "permissions": [],
            "accessSupport": {
                "text": "不支持",
                "value": "unsupported"
            },
            "indirectMenus": [],
            "buttons": [
                {
                "id": "add",
                "name": "新增",
                "permissions": [
                    {
                    "permission": "role",
                    "actions": [
                        "query",
                        "save",
                        "delete"
                    ]
                    }
                ]
                }
            ],
            "creatorId": "1199596756811550720",
            "createTime": 1688032521555,
            "supportDataAccess": false
            }
        ],
        "creatorId": "1199596756811550720",
        "createTime": 1688032467222,
        "supportDataAccess": false
    }
]
```

> 新增初始化菜单之后需要进行系统初始化才能生效

##### 修改初始化菜单

同上，在菜单管理修改对应的数据，复制对应的菜单数据，然后替换掉`baseMenu.ts`对应数据即可。

> 修改初始化菜单之后需要进行菜单初始化才能生效

##### 系统初始化

在浏览器顶部修改页面路径，`/#/`后边输入`init-home`,回车进入系统初始化页面
例如: `http://localhost:5174/#/init-home`

填写好基本信息，角色初始化等，点击确定
