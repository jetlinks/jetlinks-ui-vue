# JetLinks 前端枚举渲染规则

后端枚举如果实现 `EnumDict` 或 `I18nEnumDict`，大多数接口会把枚举字段序列化为：

```json
{"value":"item","text":"文本"}
```

前端生成页面时按这个契约处理，不要把对象直接渲染出来，也不要重复造一份文案映射。

## 基本规则

- 展示给用户时优先显示 `text`，提交、筛选、比较、状态颜色映射时使用 `value`。
- 表格列、详情字段、卡片、Tag、Badge、Tooltip、筛选 Token、导出预览都必须兼容 `{ value, text }`。
- 接口只返回字符串枚举时，按相邻模块既有映射或 i18n 规则兜底；同一字段不要同时维护多份映射。
- 后端已返回 `text` 时，不再在前端重复翻译枚举文案；前端只负责字段名、按钮、提示等界面文案的 i18n。
- 颜色、图标、排序、权限判断等稳定逻辑按 `value` 建模，不能按 `text` 判断。
- 需要向后端传参时，只传 `value`，不要把整个 `{ value, text }` 对象提交回去，除非接口契约明确要求。

## 常见落点

- 表格 / 列表：`customRender` 或 formatter 通过集中 helper 取显示文本（对象取 `text`，字符串原样，空值按现有空态）；状态组件的 value 通过同一处 helper 取 `value`。
- 详情 / 卡片：字段显示取文本 helper；状态、颜色、图标和跳转条件取 value helper。
- 表单编辑：`a-select` / `a-radio` / `a-checkbox` 的选项可由 `{ value, text }` 转为 `{ value, label: text }`，表单 model 存 `value`。
- 条件筛选：选项字段优先走 `ConditionFilter` 的 `options` / `loadOptions` / `loadSelectedOptions`；Token 显示 `text`，查询提交 `value`。
- 路由回显：URL 里保存 `value`，回显时通过 `loadSelectedOptions` 或统一映射补回 `text`。
- 兼容旧接口：同一字段可能返回字符串或对象时，集中写一个小的 normalize / display helper，不在模板里到处写三元表达式。

## 禁止写法

- 在模板里直接 `{{ record.state }}`，导致显示 `[object Object]`。
- 前端再次维护一份与后端 `I18nEnumDict` 文案重复的 `stateMap`，并让两边可能不一致。
- 按 `text === '启用'` 判断业务状态、颜色或权限。
- 表单提交整个 enum 对象，导致后端接收到 `{ value, text }` 而不是真实枚举值。
- 用 `ProSearch` 固定表单为枚举写一套私有 options，而不先评估 `ConditionFilter` 的通用选项字段能力。

## 自检

- 用户看到的是 `text`，接口收到的是 `value`。
- 同一枚举字段的文案、颜色、图标、筛选回显没有在多个组件里重复定义。
- 条件筛选和路由回显能从 `value` 恢复用户可读的 `text`。
- 后端返回对象、字符串或空值时，页面不会显示 `[object Object]` 或空白异常。
