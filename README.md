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

#### 2.默认配置

在代码根目录找到`config\config.ts`文件

> 默认图标以及系统名称优先使用基础配置的数据！

```javascript
export default {
  ...
  logo: '/favicon.ico', // 浏览器标签页logo(不要修改，如需修改默认图标请在根目录public\favicon.ico替换此文件)
  title: 'Jetlinks', // 浏览器标签页title(页面刷新状态时浏览器标签名称)
  layout: {
    title: '物联网平台', // 平台title(默认配置不生效，优先使用基础配置的数据)
    logo: '/logo.png', // 平台logo(不要修改，如需修改默认logo请在根目录public\logo.png替换此文件)
    ...
  }
}
```

### 去掉可视化部分以及修改备信息

#### 去掉可视化部分

在代码`src\views\user\Login\index.vue`文件

在第140行左右，注释以下代码
```javascript
// <div class="bottom">
//     <div class="view">
//         JETLINKS团队全新力作可视化大屏系统
//     </div>
//     <div class="url">
//         <div style="height: 33px">
//             <img :src="viewLogo" />
//         </div>
//         <a
//             href="https://view.jetlinks.cn/"
//             target="_blank"
//             rel="noopener noreferrer"
//         >
//             体验DEMO
//         </a>
//     </div>
// </div>
```


#### 修改备案信息

在代码`src\views\user\Login\index.vue`文件

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

