# JetLinks CRUD DSL 规则

本文件用于 JetLinks CRUD 中的 `createQuery()`、`createUpdate()`、`createDelete()`、`QueryParamEntity`、`toQuery()`、`toNestQuery()` 和 `QueryHelper`。适用于排序、嵌套条件、动态 QueryParam、AssetsHolder 查询注入、自定义 termType、分页查询、批量更新、批量删除、复杂 SQL 与多查询结果组合。

## 先选查询入口

1. 外部请求已有 `QueryParamEntity`
   - 优先 `createQuery().setParam(param)`，再补服务端固定条件。
   - 如果只需要在请求参数上追加条件或排序，可用 `param.toQuery()` / `param.toNestQuery(...)`。

2. 服务内部固定查询
   - 优先 `createQuery().where(...).and(...).fetch()`。
   - 不要为了几个固定条件构造控制器私有接口或手写 SQL。

3. 需要构造可复用请求参数
   - 使用 `QueryParamEntity.newQuery()...getParam()`。
   - 用于命令、订阅、远程调用、AssetsHolder 注入前的参数构造。

4. 需要批量更新或删除
   - 优先 `createUpdate()` / `createDelete()`，不要先查出列表再逐条 save / delete。
   - 必须明确 `where` 条件后再 `execute()`，避免误更新或误删除全表。

5. 复杂 SQL、原生 SQL 或多查询组合
   - 优先 `QueryHelper` / `DefaultQueryHelper`，不要按条件拼接多套 SQL 字符串。
   - SQL 语法尽量使用标准 SQL，避免绑定特定数据库方言。
   - 分页转换优先 `QueryHelper.transformPageResult(...)`。
   - 一对多装配优先 `QueryHelper.combineOneToMany(...)`。

6. 链路复杂度较高
   - 查询构造、权限注入、排序分页、结果装配、副作用不要全部压进一个 `return` 链。
   - 用命名的 `QueryParamEntity`、`buildXxxQuery(...)`、`injectXxxPermission(...)`、`fillXxx(...)` 拆出阶段。

## 常用链路

### 基础条件

```java
return service
    .createQuery()
    .where(Entity::getState, state)
    .and(Entity::getType, type)
    .fetch();
```

- `where(field, value)` 常用于第一个条件。
- `and(field, value)` 追加 AND 条件。
- `in(field, values)` 处理集合匹配；集合为空时先判断，避免生成无意义查询。
- `not`、`notIn`、`gte`、`lte`、`between`、`like` 等只在当前模块已有用法或语义明确时使用。
- 字符串字段名只在时序表、动态列、跨实体 DTO 或没有方法引用时使用；普通实体优先方法引用。

### 合并 QueryParam 与服务端条件

```java
return service
    .createQuery()
    .setParam(param)
    .where(Entity::getType, type)
    .orderBy(SortOrder.desc(Entity::getId))
    .fetch();
```

- `setParam(param)` 承接前端筛选、分页、排序和 termType。
- 服务端强制条件继续追加在 DSL 上，例如类型、租户上下文、状态约束、业务边界。
- 追加条件前先判断是否会和前端同字段条件冲突；冲突时要明确是“收窄”还是“覆盖”。

### 排序

```java
query.orderBy(SortOrder.desc(Entity::getCreateTime),
              SortOrder.desc(Entity::getId));
```

- 分页查询必须有稳定排序；时间排序后建议补 `id`、`createTime`、`sequence` 等稳定 tie-breaker。
- 用户未传排序时，可在 `queryParam.getSorts().isEmpty()` 后用 `queryParam.toQuery().orderByAsc(...)` 或 `orderByDesc(...)` 补默认排序。
- 单字段排序可用 `orderByAsc(Entity::getSortIndex)` / `orderByDesc(...)`，多字段排序优先 `orderBy(SortOrder.asc/desc(...), ...)`。
- 时序、日志、动态列可用字符串列名，例如 `orderByDesc("timestamp")`；业务实体优先方法引用，避免字段名漂移。

### 条件化追加

```java
return service
    .createQuery()
    .where(Entity::getChannelId, channelId)
    .when(CollectionUtils.isNotEmpty(types),
          query -> query.in(Entity::getType, types))
    .fetch();
```

- 可选条件优先用 `when(condition, query -> ...)`，不要手写多套重复查询。
- 空集合、空字符串、零值时间窗口要先判断；不要把空条件交给数据库或 term builder 猜语义。

### 嵌套 OR / AND

```java
return service
    .createQuery()
    .where(Entity::getState, enabled)
    .nest(nest -> {
        nest.is(Entity::getOwnerId, userId)
            .or()
            .is(Entity::getCreatorId, userId)
            .or()
            .accept(Entity::getId, CustomTermBuilder.TERM_TYPE, terms);
    })
    .fetch();
```

- `nest(...)` 用于把一组 OR 条件包成括号，常见语义是 `state = enabled AND (owner = ? OR creator = ? OR exists(...))`。
- 使用链式 `nest()` / `orNest()` 时，记得在子条件结束后 `.end()` 回到父查询。
- 不要把 OR 条件平铺到主查询上，容易把权限、状态或租户边界放宽。
- 自定义关联条件优先通过 `accept(field, termType, value)` 或 `QueryParamEntity.newQuery().getParam().getTerms()` 接入，具体 termType 规则见 `dynamic-term-rules.md`。

### QueryParamEntity 构造和改写

```java
QueryParamEntity query = QueryParamEntity
    .newQuery()
    .where(Entity::getState, enabled)
    .in(Entity::getType, types)
    .getParam();
```

- 构造请求参数后交给仓储：`repository.createQuery().setParam(query).fetch()`。
- 对外部传入参数追加条件时优先 `param.toNestQuery(q -> q.and(...))`，保留原分页、排序和筛选。
- 只补默认排序时，直接 `param.toQuery().orderByAsc(...)`，不要重建整个 QueryParam。
- 需要取消分页或指定分页时，跟随当前模块已有 `noPaging()` / `doPaging(page, size)` 用法。

### DSL 可读性

- 简单查询可以保持链式 DSL；复杂查询先给中间参数或查询对象命名。
- 嵌套条件、权限注入、默认排序、分页转换、父子装配同时出现时，拆成多个命名步骤。
- 不为了“一行 return”牺牲可读性；调用处应能看出业务阶段，而不是只看到一长串 DSL。

示例：

```java
QueryParamEntity queryParam = buildDeviceQueryParam(request);

return AssetsHolder
    .injectQueryParam(queryParam, AssetType.device, DeviceEntity::getId)
    .flatMap(param -> QueryHelper.queryPager(param, service::createQuery));
```

### AssetsHolder 查询注入

```java
return AssetsHolder
    .injectConditional(service.createQuery().where().in(Entity::getId, ids),
                       AssetType.xxx,
                       Entity::getId)
    .flatMapMany(query -> query.fetch());
```

- CRUD 查询、详情、导出、批量更新 / 删除涉及数据权限时，先路由到 `$jetlinks-assets-permission`。
- 对 `QueryParamEntity` 使用 `AssetsHolder.injectQueryParam(...)`；对 DSL 条件使用 `AssetsHolder.injectConditional(...)`。
- 权限注入后再 `fetch()` / `count()` / `execute()`，不要先查全量再内存过滤。

### 批量更新

```java
return service
    .createUpdate()
    .set(Entity::getState, state)
    .set(Entity::getUpdateTime, System.currentTimeMillis())
    .setNull(Entity::getOwnerNodeId)
    .where(Entity::getId, id)
    .execute();
```

- `set(field, value)` 用于明确赋值；相邻代码已有实体值方法引用写法时，也可跟随 `set(entity::getField)`。
- `setNull(field)` 用于清空字段，不要用魔法空字符串或特殊占位值替代 `null`。
- `when(condition, update -> update.set(...) / update.setNull(...))` 用于可选字段，避免为每个字段分支复制整段更新链路。
- `where(field, value)`、`where().in(...)`、`and(...)` 用于限定更新范围；批量更新必须能解释业务边界。
- 更新链路以 `execute()` 收尾；响应式模块中保持 `Mono` / `Flux` 链式，不要 `block()`。

常见场景：

- 状态流转：`set(State)` + `set(stateTime)` + 业务 ID 条件。
- 解绑或释放资源：`setNull(parentId / ownerNodeId / leaseExpireAt)` + 当前绑定条件。
- 批量回填：`where().in(id, ids)` + 一个或多个 `set(...)`。

### 批量删除

```java
return service
    .createDelete()
    .where(Entity::getTargetId, targetId)
    .and(Entity::getType, type)
    .execute();
```

- 能用 `createDelete()` 表达时，不要先 `query().collectList()` 再逐条删除。
- 删除前确认是否需要 AssetsHolder 操作权限、级联清理、事件副作用或软删除语义。
- 条件来自用户请求时，先验证关键 ID / 类型 / 范围，避免空条件扩大删除范围。

### QueryHelper 复杂查询

```java
return QueryHelper.transformPageResult(
    queryHelper
        .select(Dto.class)
        .all(MainEntity.class)
        .as(RelatedEntity::getName, Dto::setRelatedName)
        .from(MainEntity.class)
        .leftJoin(RelatedEntity.class, join -> join.is(RelatedEntity::getId, MainEntity::getRelatedId))
        .where(query)
        .fetchPaged(),
    list -> fillExtra(list).collectList()
);
```

- 复杂 SQL、原生 SQL、跨表查询、动态列、聚合或查询分析优先找当前模块的 `QueryHelper` / `DefaultQueryHelper` 模式。
- `QueryHelper` 能承接 `QueryParamEntity`、排序、分页和映射时，不要手写字符串拼接的动态 SQL。
- 原生 SQL 只能在 DSL / QueryHelper 明显无法表达且目标模块已有成熟模式时使用；参数必须结构化传入，禁止按条件拼接多套 SQL 变体。
- 原生 SQL 默认使用标准 SQL 和通用函数；不要写 `limit` 方言、专有 JSON / array / window 语法、特定锁语句或专用 hint，除非用户明确要求限定某个数据库，或目标模块已有明确数据库限定。
- 确需使用特定数据库方言时，必须在设计文档和 PR 中说明数据库范围、不可移植风险、回退或替代方案。
- 需要分析原生 SQL 结构时，优先走 `DefaultQueryHelper(operator).analysis(sql)` 或目标模块已有封装。
- 写 SQL 时必须按真实业务数据量、筛选组合、分页深度、排序字段、索引命中和并发访问评估性能，不只满足当前功能输出。
- 复杂 SQL、原生 SQL、聚合、深分页或多表关联需要有压力测试或等价性能验证；无法执行时在 PR 中说明阻塞原因、替代验证和剩余风险。

### 多查询结果组合

```java
return QueryHelper.combineOneToMany(
    parentFlux,
    ParentDto::getId,
    childService.createQuery().setParam(childParam),
    ChildEntity::getParentId,
    ParentDto::setChildren
);
```

- 分页结果转 DTO 或补详情：优先 `QueryHelper.transformPageResult(pageMono, list -> ...)`，不要手动复制 `total`、`pageIndex`、`pageSize` 等分页元信息。
- 父子集合装配：优先 `QueryHelper.combineOneToMany(...)`，不要每个父对象发一次子查询，也不要自己写易错的 `groupBy` / `collectMap` 组合。
- 普通分页查询可用 `QueryHelper.queryPager(queryParam, repository::createQuery)` 承接仓储 DSL。
- 组合逻辑涉及权限时，父查询和子查询都要确认 AssetsHolder 数据权限边界。

## 反模式

- 为一个筛选字段新增专用接口，而 `_query` / QueryParam 已能表达。
- 查询条件同时散落在 Controller、Service、前端私有字段和 SQL 字符串里。
- 分页查询没有稳定排序，导致翻页重复或漏数据。
- OR 条件没有用 `nest` 包住，意外放宽状态、权限或数据范围。
- 批量更新或删除没有明确 `where` 条件。
- 为清空字段写特殊占位值，而不是 `setNull(...)`。
- 拼接动态 SQL 字符串，导致筛选组合一多就膨胀出大量 SQL 分支。
- 未经用户明确要求就写特定数据库方言 SQL，导致多数据库部署不可用。
- SQL 只按小样本跑通，没有按真实数据规模、分页深度、并发和索引情况做性能验证。
- 查询、权限、排序、分页转换和结果装配全部塞进一条难以阅读的链式调用。
- 自己复制分页元信息或手写父子集合装配，而不是用 `QueryHelper.transformPageResult` / `combineOneToMany`。
- 为了省事手写租户、部门、创建人过滤，而不走 AssetsHolder。
- 只 mock `fetch()` 返回值，不验证 DSL 是否包含关键条件、排序和权限注入。

## 测试目标

- 断言核心条件：状态、类型、所属对象、时间范围、关键 termType。
- 断言排序：默认排序、用户排序、稳定 tie-breaker。
- 断言嵌套：`A AND (B OR C)` 不应退化成 `(A AND B) OR C`。
- 断言权限：允许和拒绝的 AssetsHolder 绑定都要覆盖。
- 断言分页：有稳定顺序，边界页不重复、不漏数据。
- 断言更新：`set` / `setNull` 字段、`where` 范围、批量边界和未命中行为。
- 断言组合：分页元信息保持不变，一对多装配不丢父项、不重复子项、不产生 N+1 查询。
- 断言 SQL 兼容与性能：标准 SQL 可移植性、索引命中、真实数据量、深分页、并发压力或替代性能证据。
