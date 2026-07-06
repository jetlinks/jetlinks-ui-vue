# AssetsHolder 资产权限规则

本文件约束 JetLinks 后端数据权限实现：统一使用 `AssetsHolder` 资产权限体系，不在 CRUD 或业务服务里手写平行的数据过滤方案。

## 先找本地事实

实现前先在当前工作区查找：

- `AssetType` / `EnumAssetType`：资产类型定义，常见如 `DeviceAssetType`、`NetworkAssetType`、`MediaAssetType`。
- `CrudAssetPermission` 或自定义 `AssetPermission`：读、写、删除、共享或业务自定义动作。
- `@AssetsController`：接口级资产权限注解。
- `AssetsHolderCrudController`：实体自身就是资产时的 CRUD 控制器。
- `CorrelatesAssetsHolderCrudController`：实体通过某个字段关联到另一个资产时的 CRUD 控制器。
- `AssetsHolder.injectQueryParam` / `injectConditional`：自定义查询或聚合查询的数据权限条件注入。
- `AssetsHolder.assertPermission` / `filterAssets`：详情、更新、删除、自定义动作、消息或聚合前后的编程式校验。
- `AssetSupplier`、`AssetBindProvider`、`AssetsAccessSupport`、`AssetsHolderCommandSupport`：新资产类型、绑定或命令边界相关扩展。

## 场景选择

### 实体自身是资产

优先使用：

- Controller 实现 `AssetsHolderCrudController<E, K>`
- Controller 标注 `@AssetsController(type = "...")`
- AssetType 枚举中注册该类型，并使用 `CrudAssetPermission.values()`

`AssetsHolderCrudController` 已覆盖常见 CRUD：

- `save` / `add`：自动绑定或校验保存权限
- `update`：`CrudAssetPermission.save`
- `delete`：`CrudAssetPermission.delete` 并自动解绑
- `getById`：读权限
- `query` / `queryPager` / `count`：由资产权限体系注入查询约束

### 实体关联到另一个资产

当实体本身不是资产，但应由关联对象控制权限时，优先使用：

- `CorrelatesAssetsHolderCrudController<E, K>`
- 实现 `getAssetType()`
- 实现 `getAssetIdMapper()`
- 实现 `getAssetProperty()`

适用例子：通道按设备权限控制，明细按上级资产权限控制。

### 自定义查询或聚合接口

如果方法上因为自定义逻辑使用 `@AssetsController(ignore = true)`，必须显式补资产权限处理：

- 查询参数类：`AssetsHolder.injectQueryParam(query, AssetType, Entity::getId)`
- 关联字段：`AssetsHolder.injectQueryParam(query, RelatedAssetType, "relatedAssetId")`
- 条件 DSL：`AssetsHolder.injectConditional(condition, AssetType, Entity::getId)`

不要在 SQL、QueryParam 或业务服务里手写租户、机构、部门、创建人过滤来替代 AssetsHolder。

### 详情、更新、删除、自定义动作

对单个或批量 ID 的操作，优先使用：

- `AssetsHolder.assertPermission(assetType, id, CrudAssetPermission.read)`
- `AssetsHolder.assertPermission(assetType, id, CrudAssetPermission.save)`
- `AssetsHolder.assertPermission(assetType, id, CrudAssetPermission.delete)`
- `AssetsHolder.assertPermission(source, assetType, idMapper, permission)`

批量操作要批量校验，不要逐条串行远程或数据库查询；响应式链路保持非阻塞。

### 命令服务和跨边界调用

如果能力通过命令服务暴露，优先查找本模块是否已有：

- `AssetsCrudCommandHandler`
- `BlockingAssetsCrudCommandHandler`
- `AssetsHolderCommandSupport`

跨边界调用时，不要绕过命令服务内部的 AssetsHolder 校验；调用方和提供方的权限边界要在设计稿中写清。

### 订阅、消息、Topic 或统计

需要根据用户资产范围过滤订阅或统计结果时，优先查找本地已有 helper 或 `AssetsHolder` 用法，例如：

- `AssetsHolder.currentReactive()`
- `AssetsHolder.filterAssets(...)`
- `AssetsHolder.refactorTopic(...)`
- `AssetsHolder.injectQueryParam(...)`

如果订阅框架已有统一资产过滤扩展，使用框架扩展，不在订阅处理器中手写散落过滤。

## 注释落地

- 自定义资产权限逻辑、关联资产映射、`@AssetsController(ignore = true)` 后的等价校验、管理员 / 平台例外、批量混入无权限 ID 的行为、命令或订阅中的权限传播，需要在代码旁边写短注释说明权限边界。
- 注释说明为什么权限作用在这个资产类型、这个字段或这个阶段；不要解释普通 `assertPermission` 调用本身。
- 仅使用 `AssetsHolderCrudController` / `CorrelatesAssetsHolderCrudController` 且没有自定义边界时，可沿用框架契约，不额外写噪声注释。

## 设计稿中的必填项

涉及 CRUD 或资产权限时，设计稿必须写清：

- 资产类型：使用哪个 `AssetType`，是否需要新增。
- 权限动作：读、编辑、删除、共享或自定义动作。
- 控制对象：实体自身、关联资产、父级资产、命令对象还是消息 Topic。
- 查询控制：是否由通用 CRUD 控制器自动处理，还是需要 `injectQueryParam` / `injectConditional`。
- 操作控制：详情、更新、删除、批量、自定义动作如何 `assertPermission`。
- 绑定关系：新增、保存、删除时是否需要自动绑定 / 解绑，是否已有 `AssetBindProvider`。
- 不确定项：资产归属、关联字段、管理员例外、跨租户或平台上下文不明确时，先询问用户。

## 测试要求

测试不能只验证接口返回成功。至少覆盖：

- 有权限用户能查询到授权资产。
- 无权限用户查询不到或操作被拒绝。
- 详情、更新、删除、自定义动作使用正确的 `CrudAssetPermission`。
- 关联资产场景中，权限作用在正确字段上。
- 批量操作中混入无权限 ID 时行为符合业务约定。
- 自定义查询、聚合和导出不会绕过 `AssetsHolder.injectQueryParam`。
- 自定义权限边界和非显而易见的关联映射已有代码注释说明。

如果当前测试环境难以构造完整 `AssetsHolder` 上下文，可以使用组件内已有测试风格、契约测试或局部 adapter 测试，但必须验证关键权限调用和参数，不要把 `AssetsHolder` mock 成永远通过。

## 禁止

- 手写 `tenant_id = currentTenant`、`creator_id = currentUser`、`org_id in (...)` 当作通用数据权限方案。
- 在 Controller 上加 `@AssetsController(ignore = true)` 后不补等价校验。
- 为了测试方便放宽生产代码权限判断。
- 只校验功能权限 `@QueryAction` / `@SaveAction`，却漏掉资产数据权限。
- 未确认资产类型和权限动作就默认全量可见或默认全部拒绝。
