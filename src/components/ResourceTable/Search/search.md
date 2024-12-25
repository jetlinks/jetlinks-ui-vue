# Search组件

- 需要结合Table使用

## 属性

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 查询下拉列表 | JColumnsProps[] | [] |
| type | 查询模式 | 'advanced', 'simple' | 'advanced' |
| target | 查询组件唯一key | String |  |
| search | 查询回调事件 | Function |  |

> JColumnsProps[*].search

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rename | 用来重命名查询字段值 | String |  |
| type | 查询值组件类型 | 'select', 'number', 'string', 'treeSelect', 'date', 'time' | |
| options | Select和TreeSelect组件下拉值 | Array, Promise |  |
| first | 控制查询字段下拉默认值，默认为name即名称 | Boolean |  |
| defaultTermType | 查询条件 | String |  |
| handleValue | 处理单个查询value值 | Function |  |

## 基础用法

> columns中包含search属性才会出现在查询下拉中

```vue
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
          type: 'string',
        }
      }
    ]
  const search = (params) => {
}
  <Search
    :columns='columns'
    target='device'
    @search='search'
  />
```

> rename的作用在于search抛出params会根据rename修改数据中column的值

```vue
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
          type: 'string',
          rename: 'TestName'
        }
      }
    ]
  const search = (params) => {
    terms: [
      {
        column: 'TestName',
        value: '',
        termType: 'like'
      }
    ]
  }
  <Search
    :columns='columns'
    target='device'
    @search='search'
  />
```

> defaultTermType的作用在于设置查询条件,相关条件参考util中的termType

```vue
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
          type: 'string',
          defaultTermType: 'gt'
        }
      }
    ]
  const search = (params) => {
    terms: [
      {
        column: 'TestName',
        value: '',
        termType: 'gt'
      }
    ]
  }
  <Search
    :columns='columns'
    target='device'
    @search='search'
  />
```
