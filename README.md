# jetlinks-ui-vue

[更新说明](./CHANGELOG.md)

## 运行以及安装步骤
推荐使用pnpm命令运行该项目，[安装pnpm](https://www.pnpm.cn/installation)

### 1. 拉取子仓库
```shell
pnpm modules:init
```

### 2. 安装依赖
```shell
pnpm install
```

### 3. 运行
```shell
pnpm dev
```
- 运行完成之后在浏览器访问`http://localhost:9100`即可

### 4. 其它指令

```shell
# 更新子仓库
pnpm modules:update

# 打包
pnpm build
```

## 依赖包

### @jetlinks-web/components

通用业务组件在`main.ts`中已经全局注册，无需引入，直接使用

#### AMap(地图)

<a id="a_map"></a>对 [vue-amap](https://vue-amap.guyixi.cn/)
进行了封装，相关[api](https://vue-amap.guyixi.cn/zh-cn/base/amap.html)

``` html
<template>
    <div style="width: 100%; height: 300px">
        <j-aMap
            @dragstart="mapClick"
            mapStyle="dark"
        >
            <el-amap-marker
            :position="[0,0]"
            />
        </j-aMap>
    </div>
</template>

<script lang="ts" setup>
const mapClick = (e: any) => {
  console.log(e)
}
</script>
```

#### BadgeStatus(状态标签)

``` html
<template>
    <j-badge-status
        :status="status"
        :text="status ? '正常' : '禁用'"
        :statusNames="{
            1: 'success',
            0: 'error',
        }"
    ></j-badge-status>
</template>

<script lang="ts" setup>
const status = ref(1)
</script>
```

##### API

| 属性                                      | 说明      | 类型            | 默认值                                                                                     |
|-----------------------------------------|---------|---------------|-----------------------------------------------------------------------------------------|
| text                                    | 自定义文本   | string        | -                                                                                       |
| status                                  | 自定义状态   | string、number | -                                                                                       |
| [statusNames](#BadgeStatus_statusNames) | 状态对应的名字 | object        | { 'success': 'success','warning': 'warning',  'error': 'error',  'default': 'default' } |

<a id="BadgeStatus_statusNames"></a>

##### statusNames设置其他值

``` javascript
{
  //告警颜色
  'level1': '229, 0,  18',
  'level2': '255, 148,  87',
  'level3': '250, 189,  71',
  'level4': '153, 153, 153',
  'level5': '196, 196,  196'
}
```

#### CardSelect(卡片选择器)

卡片选择框

``` html
<template>
    <j-card-select
        v-model:value="value"
        float="right"
        :options="options"
        :column="2"
        :showImage="false"
        :multiple="true"
    >
    </j-card-select>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';

const value = ref<any>();
const state = reactive({
    options: [
        {
            value: '1',
            label: '识别性',
        },
        {
            value: '2',
            label: '独特性',
        },
    ],
});

const { options } = toRefs(state);
</script>
```

##### API

###### CardSelect

| 属性                                      | 说明      | 类型            | 默认值                                                                                     |
|-----------------------------------------|---------|---------------|-----------------------------------------------------------------------------------------|
| text                                    | 自定义文本   | string        | -                                                                                       |
| status                                  | 自定义状态   | string、number | -                                                                                       |
| [statusNames](#BadgeStatus_statusNames) | 状态对应的名字 | object        | { 'success': 'success','warning': 'warning',  'error': 'error',  'default': 'default' } |

| 属性           | 说明                                        | 类型                    | 默认值                                                                                               |
|--------------|-------------------------------------------|-----------------------|---------------------------------------------------------------------------------------------------|
| value        | v-model绑定                                 | `string string[]`     | -                                                                                                 |
| type         | 以配置形式设置布局方式                               | `vertical horizontal` | horizontal                                                                                        |  
| options      | 以配置形式设置子元素                                | Array                 | `Array<{value:string number label: string subLabel?: string iconUrl: string disabled?: boolean}>` |                       |            |
| disabled     | 禁选所有子单选器，单项禁用在 options 中设置`disabled=true` | boolean               | false                                                                                             |
| multiple     | 是否多选                                      | boolean               | false                                                                                             |
| float        | 文本浮动方向，不可以与type="vertical"同时使用            | `left                 | right`                                                                                            | left | - |
| column       | 每行显示子元素个数，如果设置的数值超过子元素个数，则使用默认值           | Number                | 3                                                                                                 | - |
| noColumn     | 是否使设置的column失效                            | boolean               | false                                                                                             | - |
| showImage    | 是否显示Image                                 | boolean               | true                                                                                              | - |
| showSubLabel | 是否显示subLabel                              | boolean               | true                                                                                              | - |
| allowClear   | 单选的情况下是否可以取消选择                            | boolean               | false                                                                                             | - |

###### CardSelectOption

| 属性       | 说明       | 类型      | 默认值   |
|----------|----------|---------|-------|
| value    | 绑定值      | string  | -     |
| label    | label    | `string | slot` | - |
| subLabel | subLabel | `string | slot` | - |
| image    | 图片地址     | `string | slot` | - |

#### CheckButton(选择按钮)

选择按钮

``` html
<template>
    <j-check-button
        :options="[
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
            { label: '选项3', value: '3' },
            { label: '选项4', value: '4', disabled: true },
        ]"
        v-model:value="value"
    />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref();
</script>

<style scoped></style>
```

##### API

| 属性       | 说明                      | 类型                                                           | 默认值       |
|----------|-------------------------|--------------------------------------------------------------|-----------|
| multiple | 多选                      | boolean                                                      | false     | 
| disabled | 失效状态                    | boolean                                                      | false     |    
| value    | 与 CheckboxGroup 组合使用时的值 | boolean \| string \| number                                  | -         |  
| options  | 选择项                     | Array&lt;{ label: string value: string disabled?: boolean }> | \[]       |  
| class    | 类名                      | string                                                       | undefined | 
| style    | css样式                   | CSSProperties                                                | {}        | 

##### 事件

| 事件名称   | 说明      | 回调参数                  | 默认值                     | 版本 |     |
|--------|---------|-----------------------|-------------------------|----|-----|
| change | 变化时回调函数 | Function(keys: string | string[], nodes: any[]) | -  |     |

#### j-ellipsis(填充页面)

内容超长显示省略号

```html

<template>
  <j-ellipsis style="max-width: 240px">
    水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处
    才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚
    欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春
    千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归
    又送君归去 若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处
    才始送春归 又送君归去 若到江南赶上春 千万和春住水是眼波横 山是眉峰聚
    欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春
    千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归
    又送君归去 若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处
    才始送春归 又送君归去 若到江南赶上春 千万和春住水是眼波横 山是眉峰聚
    欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春
    千万和春住水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归
    又送君归去 若到江南赶上春 千万和春住水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住
  </j-ellipsis>
  <j-ellipsis> 水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处</j-ellipsis>
</template>
```

##### API

| 属性             | 说明             | 类型                                   | 默认值 |
|----------------|----------------|--------------------------------------|-----|
| expand-trigger | 展开的触发方式        | 'click'                              | -   |  
| line-clamp     | 最大行数           | `number` \| `string`                 | -   | 
| tooltip        | Tooltip 的属性或内容 | `boolean` \| `TooltipProps`\| `Slot` | -   | 

#### Empty(空状态)

空状态时的展示占位图

```html

<template>
  <j-empty/>
</template>
```

##### API

| 属性          | 说明                         | 类型               | 默认值   |
|-------------|----------------------------|------------------|-------|
| description | 自定义描述内容                    | string \| v-slot | -     | 
| image       | 设置显示图片，为 string 时表示自定义图片地址 | string \| v-slot | false |  
| imageStyle  | 图片样式                       | CSSProperties    | -     |  

##### 内置图片

- Empty.PRESENTED_IMAGE_SIMPLE

  <img src="https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png" height="35px" />

- Empty.PRESENTED_IMAGE_DEFAULT

  <img src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" height="70px" />

#### FullPage(填充页面)

将剩下的页面填充

``` html
<template>
    <j-full-page>
        <div class="container">
            <div class="left">
                left    
            </div>
            <div class="right">
                right
            </div>
        </div>
    </j-full-page>
</template>
```

#### Icon(图标)

其中我们提供了三种主题的图标，不同主题的 Icon 组件名为图标名加主题做为后缀。
更多 antd 官方图标参考 https://www.antdv.com/components/icon-cn

```html

<AIcon type="UpCircleOutlined"/>
<AIcon type="UpCircleFilled"/>
<AIcon type="UpCircleTwoTone"/>
```

##### API

###### 通用图标

| 属性        | 说明      | 类型     | 默认值                                        | 
|-----------|---------|--------|--------------------------------------------|
| type      | 图标类型    | string | ZoomOutOutlined                            | 
| scriptUrl | 自定义图标地址 | string | //at.alicdn.com/t/font_8d5l8fzk5b87iudi.js |   

> 支持 antd 官方全部图标，官网图标使用大驼峰命名，自定义图标使用小写短横线写法

###### 自定义图标

> 自定义图标，需要需要传入`scriptUrl`,默认地址`'//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'`

```jsx
<AIcon type="icon-xiazai" scriptUrl="/public/iconfont.js"/>
<AIcon type="icon-dianzan"/>
```

#### ConfigProvider

JConfigProvider组件新增 IconConfig和MapConfig，作为全局的配置

```html
<JConfigProvider :IconConfig="{ scriptUrl: '//at.alicdn.com/t/c/font_4035907_o5hxqjo7dq.js'}">
  <AIcon type="icon-xiazai"/>
</JConfigProvider>
```

#### PermissionButton(权限按钮)

按钮权限组件支持antdv的[Button](https://www.antdv.com/components/button-cn#api)
组件全部api，同时新增了按钮权限以及二次确认等功能

``` html
<template>
    <j-permission-button
      type="primary"
      :hasPermission="true"
      :tooltip="{ title: '新增' }"      
      :popConfirm="{
        title: `确定要新增吗？`,
        onConfirm: () => {
          console.log('新增')
        },
      }"
    >
      新增
    </j-permission-button>
</template>

```

##### API

| 属性            | 说明                                                               | 类型                                        | 默认值  |
|---------------|------------------------------------------------------------------|-------------------------------------------|------|
| tooltip       | 文字提示[相关api](https://www.antdv.com/components/tooltip-cn)         | object:{ title: '' }                      | -    |
| popConfirm    | 气泡确认框[相关api](https://www.antdv.com/components/popconfirm-cn#api) | object:{ title: '', onConfirm: () => {},} | -    |
| hasPermission | 权限控制                                                             | boolean                                   | true |

#### ProTable(高阶表格)

结合search组件进行数据查询

```html

<template>
  <j-advanced-search
          :columns="columns"
          target="search-table"
          @search="handleParams"
  />
  <j-pro-table
          :columns="columns"
          :request="query"
          :params="params"
          :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
          ref="instanceRef"
          :pagination="{
            pageSizeOptions: ['10', '20'],
        }"
  >
    <template #headerLeftRender
    >
      <a-button type="primary" @click="refresh"
      >刷新页面
      </a-button
      >
    </template
    >
    <template #card="slotProps">
      <div
              style="width: 100%; border: 1px solid lightgray; padding: 20px"
      >
        <p>年龄： {{ slotProps?.age }}</p>
        <p>{{ slotProps?.address }}</p>
      </div>
    </template>
  </j-pro-table>
</template>

<script lang="ts" setup>
  import { random } from 'lodash';
  import { ref } from 'vue';

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      search: {
        type: 'string',
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      search: {
        type: 'number',
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const instanceRef = ref < Record < string, any
  >>
  ({});
  const params = ref < Record < string, any
  >>
  ({});

  const query = (_params: Record<string, any>) =>
          new Promise((resolve) => {
            const data = Array(100000)
                    .fill(1)
                    .map((item, index) => {
                      return {
                        key: index + item,
                        name: 'John Brown',
                        age: random(100),
                        address: 'New York No. 1 Lake Park',
                      };
                    });
            const _from = _params.pageIndex * _params.pageSize;
            const _to = (_params.pageIndex + 1) * _params.pageSize;
            setTimeout(() => {
              resolve({
                result: {
                  data: data.slice(_from, _to),
                  pageIndex: _params.pageIndex || 0,
                  pageSize: _params.pageSize || 10,
                  total: data.length,
                },
                status: 200,
              });
            }, 500);
          });

  const refresh = () => {
    instanceRef.value?.reload();
  };

  const handleParams = (p: Record<string, any>) => {
    params.value = p;
  };
</script>
```

##### API

###### Table

该属性参考 ant-design-vue 的 [Table](https://www.antdv.com/components/table-cn#Table)

| 属性               | 说明                                                                                                             | 类型              | 默认值       |
|------------------|----------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| request          | 请求数据的 api                                                                                                      | promise         | -         |  
| loading          | 控制loading                                                                                                      | boolean         | undefined |   
| columns          | 表格列的配置描述                                                                                                       | array           | -         |   
| params           | 搜索参数                                                                                                           | object          | {}        |    
| type             | 表格的类型                                                                                                          | `TREE`\| `PAGE` | 'PAGE'    |  
| noPagination     | 是否显示分页                                                                                                         | boolean         | trues     |  
| rowSelection     | 列表项是否可选择                                                                                                       | object          | -         |   
| dataSource       | 数据数组                                                                                                           | object\[]       |           |    
| gridColumns      | 用于不同分辨率下展示的卡片数量的展示，gridColumns\[0] 1366 ~ 1440 分辨率，gridColumns\[1] 1440 ~ 1600 分辨率, gridColumns\[2] > 1600 分辨率 | number[]        | -         |   
| gridColumn       | 每行展示的卡片数量                                                                                                      | number          | -         |  
| alertRender      | 是否展示上方选择提示框                                                                                                    | boolean         | true      |    
| defaultParams    | 默认参数                                                                                                           | object          | {}        |    
| bodyStyle        | 内容区域自定义样式                                                                                                      | object          | -         |    
| card             | 卡片插槽                                                                                                           | slot            | -         |    
| headerTitle      | type 为`PAGE`和`TREE`时顶部左边插槽                                                                                     | slot            | -         |    
| rightExtraRender | type 为`PAGE`和`TREE`时顶部右边插槽                                                                                     | slot            | -         |    
| paginationRender | 分页插槽                                                                                                           | slot            | -         |    

###### Column

该属性参考 ant-design-vue 的 [Column](https://www.antdv.com/components/table-cn#Column).

| 属性          | 说明       | 类型      | 默认值   | 
|-------------|----------|---------|-------|
| scopedSlots | 是否为插槽    | boolean | false |   
| hideInTable | 是否在表格中隐藏 | boolean | -     |   

###### 事件

| 事件名称         | 说明   | 回调参数       | 
|--------------|------|------------|
| cancelSelect | 取消选择 | () => void | 

#### Search(滚动条)

滚动条

``` html
<template>
  <j-scrollbar height="400">
    <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
      {{ item }}
    </p>
  </j-scrollbar>
</template>
<style scoped lang="less">
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: #ecf5ff;
  color: #47a2ff;
}
</style>
```

##### API

| 属性         | 说明                                 | 类型              | 默认值   |
|------------|------------------------------------|-----------------|-------|
| height     | 滚动条高度                              | string / number | —     |
| max-height | 滚动条最大高度                            | string / number | —     |
| native     | 是否使用原生滚动条样式                        | boolean         | false |
| wrap-style | 包裹容器的自定义样式                         | string / object | —     |
| wrap-class | 包裹容器的自定义类名                         | string          | —     |
| view-style | 视图的自定义样式                           | string / object | —     |
| view-class | 视图的自定义类名                           | string          | —     |
| noresize   | 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能 | boolean         | false |
| tag        | 视图的元素标签                            | string          | div   |
| always     | 滚动条总是显示                            | boolean         | false |
| min-size   | 滚动条最小尺寸                            | number          | 20    |

#### ValueItem

``` html
<template>
    <j-value-item
        v-model:modelValue="modelValue"
        itemType="int"
        style="width: 200px"
        placeholder="请输入"
    ></j-value-item>
    <j-value-item
        v-model:modelValue="modelValue"
        itemType="date"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        style="width: 200px"
        @change="onChange"
    ></j-value-item>
    <j-value-item
        v-model:modelValue="modelValue"
        itemType="enum"
        style="width: 200px"
        mode="multiple"
        :options="[
        {
            value: '11111',
            label: '11111',
        },
        {
            value: '22222',
            label: '22222',
        },
        ]"
        placeholder="请选择"
        @change="onChange"
    ></j-value-item>
    <j-value-item
        v-model:modelValue="modelValue"
        itemType="geoPoint"
        style="width: 200px"
        placeholder="请输入"
        v-bind="mapProps"
    ></j-value-item>
</template>
<script lang="ts" setup>
const modelValue = ref(undefined)
const mapProps = ref({
    zoom: 12,
    center: [106.534144, 29.519712],
    securityJsCode: '1e380e97bc94f06b63b9a2f76cc6079d',
})
const onChange = (e: string) => {
    console.log(2, e)
}
</script>
```

##### API

| 属性                             | 说明        | 类型                                                                                 | 默认值                                                                     |
|--------------------------------|-----------|------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| v-model:modelValue             | 输入框内容     | string                                                                             | -                                                                       |
| itemType                       | 组件类型      | int、long、float、double、string、array、password、enum、boolean、date、object、geoPoint、file | string                                                                  |
| placeholder                    | 输入框提示语    | string                                                                             | -                                                                       |
| mode                           | 多选框       | multiple、tags、combobox                                                             | ' '                                                                     |
| options                        | 下拉选择框下拉数据 | array                                                                              | -                                                                       |
| valueFormat                    | 格式化       | string                                                                             | YYYY-MM-DD HH:mm:ss                                                     |
| action                         | 上传的地址     | `string                                                                            | (file) => Promise`                                                      | - |
| headers                        | 设置上传的请求头部 | object                                                                             | {'X-Access-Token(默认[VITE_TOKEN_KEY](#.env.development))':'默认登录时的token'} |
| onChange                       | 数据改变时触发   | function                                                                           | value: string                                                           |
| [v-bind](#GeoComponent_v-bind) | 其他属性      | object                                                                             | -                                                                       |

### @jetlinks-web/constants

常量

#### 常用

有 `TOKEN_KEY`、`BASE_API`，分别是从开发环境的`VITE_TOKEN_KEY`和`VITE_APP_BASE_API`
中获取，对应变量在项目文件[.env.development](#.env.development)自行配置

#### 其他

`ContentTypeEnum` ContentType相关配置

``` javascript
{
    JSON: 'application/json;charset=UTF-8',
    FORM_QS: 'application/x-www-form-urlencoded;charset=UTF-8',
    FORM: 'multipart/form-data;charset=UTF-8'
}
```

#### 使用

``` javascript
import { TOKEN_KEY, BASE_API, ContentTypeEnum } from '@jetlinks-web/constants'

console.log(TOKEN_KEY, BASE_API); //X-Access-Token, /api 
console.log(ContentTypeEnum); 
// {
//     "JSON": "application/json;charset=UTF-8",
//     "FORM_QS": "application/x-www-form-urlencoded;charset=UTF-8",
//     "FORM": "multipart/form-data;charset=UTF-8"
// }
```

### @jetlinks-web/hooks

包含常用的 `useIcon` `useNetwork` `usePermission` `useRouterParams`

#### useRequest

简化处理异步请求的逻辑，提供了方便的数据响应和错误处理。

``` html
<template>
  <div>
    <p v-if="loading">加载中...</p>
    <ul v-if="data">
      <li v-for="item in data" :key="item.id">{{ item.name }}</li>
    </ul>
    <button @click="fetchData">获取数据</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRequest } from '@jetlinks-web/hooks'
import { request } from '@jetlinks-web/core';

interface Item {
  id: number;
  name: string;
}

const data = ref<Item[]>([]);

// 使用 useRequest Hook 来管理异步请求和加载状态
/**
 * 处理异步请求
 * @param {Function} request 异步请求函数
 * @param {Object} options 请求选项，默认值 
 * {   immediate: true,  //主动触发
 *     formatName: 'result' 
 * }
 * @returns {Object} 包含响应式数据和方法的对象 
 * { 
 *  data, //响应式数据
 *  loading, //响应式状态
 *  run //执行函数，手动运行
 * }
 */
const { run, loading } = useRequest<Item[]>(queryData, {
  onSuccess,
  onError,
  immediate: false, //是否主动触发
});

// 异步获取数据的函数
async function queryData(id:string): Promise<Item[]> {
  const response = await request.get(`https://api.example.com/data?id=${id}`);
  return response.data.items;
}


function fetchData() {
    // 手动运行run，在run中传参
    run('123_id')
    .then((result) => {
        data.value = result;
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        loading.value = false;
    });
}


// 请求成功的回调函数
function onSuccess(response: Item[]): void {
//   data.value = response;
}

// 请求失败的回调函数
function onError(error: Error): void {
  console.error(error);
}


// 默认主动触发run 请求结束之后直接拿到响应式的data数据
const { data: _data } = useRequest(fetchData)

</script>
```

##### useRouterParams

提供两个方法 `useRouterParams()`返回当前路由参数`{ params }` 和 `setParamsValue(code, name)`
设置当前路由参数

###### useRouterParams

``` javascript
import { useRouterParams } from '@jetlinks-web/hooks'
import { useMenuStore } from '@/store/menu'

const { jumpPage } = useMenuStore()
// setParamsValue在jumpPage跳转页面时使用
jumpPage(`system/Role/Detail`, {
    params: {
        id: '123',
    },
})

const routerParams = useRouterParams();

console.log(routerParams.params.value.id) // 123
```

###### setParamsValue

setParamsValue在jumpPage跳转页面时使用

``` javascript
import { router } from '@jetlinks-web/router'
import { setParamsValue } from '@jetlinks-web/hooks'

/**
 * 页面跳转
 * @param name 路由name
 * @param param1 {Object} 需要传递的参数
 */
const jumpPage = (name: string, { params, query }: { params?: Record<string, any>, query?: Record<string, any>}) => {
    if (hasMenu(name)) {
        router.push({ name, params, query })
        setParamsValue(name, params)
    } else {
        console.warn(`没有找到对应的页面: ${name}`)
    } 
}

```

### @jetlinks-web/utils

通用工具函数

#### getAMapUiPromise

动态加载高德地图UI库

``` javascript
import { getAMapUiPromise } from '@jetlinks-web/utils'

/**
 * 获取高德地图UI库的Promise
 * @param version 高德地图UI库的版本号，默认为 '1.0'
 * @returns 返回一个Promise，在高德地图UI库加载完成后执行回调
 */
getAMapUiPromise('1.1').then(() => {});

```

#### getAppConfigFileName

获取应用程序配置

``` javascript
/**
 * 获取应用程序配置文件名
 * @param env 环境变量对象，类型为 ENV
 * @returns 返回应用程序配置文件名
 */
const env = import.meta.env
const ENV_NAME = getAppConfigFileName(env)
```

#### getGlobalConfig

获取全局配置

``` javascript
/**
 * 获取全局配置对象
 * @param env 环境变量对象，类型为 ENV
 * @returns 返回全局配置对象，包含 apiUrl 属性
 */
const env = import.meta.env
const glob = getGlobalConfig(env)
```

#### buildScriptTag

构建 script 标签

``` javascript
/**
 * 构建 script 标签
 * @param src script 标签的 src 属性值
 * @returns 返回构建的 script 标签对象
 */
const protocol = window.location.protocol;
const script = buildScriptTag(`${protocol}//webapi.amap.com/ui/1.1/main-async.js`);
```

#### downloadFileByUrl

根据 URL 下载文件

``` javascript
/**
 * 根据 URL 下载文件
 * @param url 文件的 URL
 * @param name 下载文件的名称
 * @param type 下载文件的类型
 */
downloadFileByUrl('https://example.com/file.pdf', 'myFile', 'pdf');

```

#### encrypt

使用公钥对文本进行加密

``` javascript
import { encrypt } from '@jetlinks-web/utils'

/**
 * 使用公钥对文本进行加密
 * @param txt 要加密的文本
 * @param publicKey 公钥字符串
 * @returns 返回加密后的文本
 */
// 假设你有一个公钥
const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAMkQlL4vIvGzF7DQbM4y1zB9T\n" +
    "M7nXnRt3N6L0QIdXfEzj6DvZ1dnD+jZx85iN7DQo4uRlOx3uFOb7gU2yq7q5eXTh\n" +
    "BZdNfjK2wN5Sv0GnLsJkTcDc3l6Z6gI4y3g3k9P2mZ7D1fV5XzqRy2+3vugx2WcG\n" +
    "bQq8+5HgnjH1bCK1lwIDAQAB\n" +
    "-----END PUBLIC KEY-----"

// 调用 encrypt 函数加密文本
const encryptedText = encrypt("Hello World", publicKey)
console.log(encryptedText) // 输出加密后的文本
```

#### regular

常用正则表达式

- `isUrl`: 用于校验URL，匹配方法为 isUrl(path: string): boolean。
- `isEnglishOrNumber`: 用于校验只允许输入英文或数字，匹配方法为 isEnglishOrNumber(value: string):
  boolean。
- `isCronReg`: 用于校验cron表达式，匹配方法为 isCronReg(cron: string): boolean。
- `isEnglish`: 用于校验只允许输入英文，匹配方法为 isEnglish(value: string): boolean。
- `isChinese`: 用于校验只允许输入中文，匹配方法为 isChinese(value: string): boolean。
- `isTelephone`: 用于校验座机号码，匹配方法为 isTelephone(phone: string): boolean。
- `isCellphone`: 用于校验手机号码，匹配方法为 isCellphone(phone: string): boolean。
- `isIpReg`: 用于校验IP地址，匹配方法为 isIpReg(value: string): boolean。
- `isIpv6`: 用于校验IPv6地址，匹配方法为 isIpv6(value: string): boolean。
- `isDomain`: 用于校验域名，匹配方法为 isDomain(value: string): boolean。
- `isEmail`: 用于校验邮箱地址，匹配方法为 isEmail(value: string): boolean。
- `isPassword`: 用于校验密码强度，必须至少包含大小写英文和数字，匹配方法为 isPassword(value: string):
  boolean。
- `isInputReg`: 用于校验数字字母，小写字母开头，匹配方法为 isInputReg(value: string): boolean。
- `isModalReg`: 用于校验数字字母下划线，字母开头，匹配方法为 isModalReg(value: string): boolean。
- `isTextReg`: 用于校验中文，匹配方法为 isTextReg(value: string): boolean。
- `isColorReg`: 用于校验颜色，匹配方法为 isColorReg(value: string): boolean。
- `isSql`: 用于校验sql语句，匹配方法为 isSql(value: string): boolean。
- `isImg`: 用于校验图片格式，匹配方法为 isImg(value: string): boolean。

``` javascript
import { regular } from '@jetlinks-web/utils'

regular.isEmail('123@qq.com')
```

#### getImage

静态图片资源处理

``` javascript
import { getImage } from '@jetlinks-web/utils'

/**
 * 静态图片资源处理
 * @param path {String} 路径
 */
const imagePath = '/logo.png';
const imageUrl = getImage(imagePath);
console.log(imageUrl); // 输出完整的图片 URL
```

#### onlyMessage

单个message提示

``` javascript
import { onlyMessage } from '@jetlinks-web/utils'

/**
 * 单个message提示，根据类型只提示一次
 * @param msg 消息内容
 * @param type 消息类型，可选值为 'success' | 'error' | 'warning'，默认为 'success'
 */
const successMessage = '操作成功';
const errorMessage = '发生错误';

onlyMessage(successMessage); // 显示默认类型为 'success' 的消息提示
onlyMessage(errorMessage, 'error'); // 显示类型为 'error' 的消息提示
```

#### getSlot

获取插槽内容

``` javascript
import { getSlot } from '@jetlinks-web/utils'

/**
 * 获取插槽内容
 * @param slots 插槽对象
 * @param props 属性对象
 * @param prop 插槽名称，默认为 'default'
 * @returns 插槽内容的类型为 T，如果插槽设置为 false，则返回 false
 */
// 假设有一个插槽对象 slots 和一个属性对象 props
const slots = { default: '插槽内容' };
const props = { default: '默认属性值' };

const slotContent = getSlot(slots, props);
console.log(slotContent); // 输出 '插槽内容'

const nonExistentSlotContent = getSlot(slots, props, 'nonExistentSlot');
console.log(nonExistentSlotContent); // 输出 false，因为指定的插槽不存在

const falseSlotContent = getSlot(slots, props, 'default');
console.log(falseSlotContent); // 输出 false，因为指定的插槽被设置为 false

```

#### getSlotVNode

获取插槽内容的 VNode

``` javascript
import { getSlotVNode } from '@jetlinks-web/utils'

/**
 * 获取插槽内容的 VNode
 * @param slots 插槽对象
 * @param props 属性对象
 * @param prop 插槽名称，默认为 'default'
 * @returns VNode 的类型为 T，如果插槽设置为 false，则返回 false
 */
// 假设有一个插槽对象 slots 和一个属性对象 props
const slots = { default: () => '插槽内容' };
const props = { default: '默认属性值' };

const slotVNode = getSlotVNode(slots, props);
console.log(slotVNode); // 输出 '插槽内容' 的 VNode

const nonExistentSlotVNode = getSlotVNode(slots, props, 'nonExistentSlot');
console.log(nonExistentSlotVNode); // 输出 false，因为指定的插槽不存在

const falseSlotVNode = getSlotVNode(slots, props, 'default');
console.log(falseSlotVNode); // 输出 false，因为指定的插槽被设置为 false
```

#### randomString

生成指定长度的随机字符串

``` javascript
import { randomString } from '@jetlinks-web/utils'

/**
 * 生成指定长度的随机字符串
 * @param length 长度，默认为 32
 * @returns 随机字符串
 */
const randomStr = randomString(10);
console.log(randomStr); // 输出一个长度为 10 的随机字符串
```

#### getBase64ByImg

将图片转换为 base64 格式

``` javascript
import { getBase64ByImg, onlyMessage } from '@jetlinks-web/utils'
/**
 * 将图片转换为 base64 格式
 * @param img 图片文件
 * @param callback 转换完成后的回调函数，接收 base64 URL 作为参数
 */
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  getBase64ByImg(file, (base64Url) => {
    console.log(base64Url); // 输出转换后的 base64 URL
  });
});

//或者
const beforeUpload = (file: any) => {
  const types = (props.types || []) as Array<string>
  const inType = types.includes(file.type)
  const maxSize = (props.size || 2) as number // 文件最大多少兆
  const isMaxSize = (file.size / 1024 / 1024) < maxSize

  if (!inType) {
    onlyMessage('请上传正确格式的图片', 'error')
  }

  if (!isMaxSize) {
    onlyMessage(`图片大小必须小于${maxSize}M`, 'error');
  }
  getBase64ByImg(file, base64Url => {
    console.log(base64Url); // 输出转换后的 base64 URL
  })
  return false
}

```
