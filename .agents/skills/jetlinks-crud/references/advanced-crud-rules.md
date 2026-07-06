# JetLinks 高级 CRUD 与查询规则

本文件处理“标准 CRUD 之外”的情况，包括复杂查询、批处理、数据同步和性能敏感逻辑。

## 何时使用

- 需要 `createQuery`、`createUpdate`、`createDelete`
- 需要 QueryHelper、分页转换、聚合查询、关联查询
- 保存或删除后需要同步其他数据
- 需要避免逐条更新、重复查询、阻塞式拼装

## 核心原则

1. 先复用当前模块已有查询方式
   - 有 `createQuery` 就优先用它。
   - 有 QueryHelper 或专用查询抽象，就跟随它。
   - `createQuery()` / `createUpdate()` / `createDelete()` / `QueryParamEntity` / `QueryHelper` 的细节见 [`query-dsl-rules.md`](query-dsl-rules.md)。

2. 复杂副作用尽量拆到事件层
   - CRUD 主流程负责数据本身。
   - 联动、同步、广播、清理优先交给事件处理器。

3. 批处理优先批量化
   - 批量更新、批量删除、分页转换、缓冲处理，尽量避免 N 次往返。

4. 复杂 SQL 先走 QueryHelper
   - 跨表、聚合、动态列、分页转换、原生 SQL 分析或执行，优先找 `QueryHelper` / `DefaultQueryHelper` / 当前模块封装。
   - 不拼接动态 SQL 字符串来覆盖条件组合，避免 SQL 数量随筛选项膨胀。
   - SQL 默认按标准 SQL 和多数据库兼容设计；除非用户明确限定数据库或模块已有明确限定，不写特定数据库方言。
   - 只有当前模块已有成熟模式或 DSL / QueryHelper 明显无法表达时，才使用原生 SQL。
   - 确需数据库方言时，在设计文档和 PR 中标明数据库范围、不可移植风险、替代方案和回退方式。

5. 多查询组合先走 QueryHelper
   - 分页转 DTO 优先 `QueryHelper.transformPageResult(...)`。
   - 一对多父子装配优先 `QueryHelper.combineOneToMany(...)`。
   - 普通 QueryParam 分页优先 `QueryHelper.queryPager(queryParam, repository::createQuery)` 或当前模块等价封装。

6. SQL 性能按真实场景验证
   - 写 SQL 时先估算真实数据量、筛选组合、排序字段、分页深度、索引命中和并发访问。
   - 复杂 SQL、原生 SQL、聚合、多表关联、深分页或批量写入需要压力测试或等价性能验证。
   - 不能压测时必须说明缺失环境、替代验证和剩余风险，不要只说“满足需求”。

## 推荐模式

### 动态查询

适用：
- 用户传入 QueryParam
- 需要组合条件、排序、分页

要求：
- 保留现有查询体系，不自创请求协议
- 优先让查询对象驱动仓储或服务层

### 批量更新 / 删除

适用：
- 保存后回填名称、清理关联数据、统一状态变更

要求：
- 优先使用批量 `createUpdate` / `createDelete`
- 清空字段用 `setNull(...)`，不要写特殊占位值
- 可选字段用 `when(...)`，不要复制多套更新链路
- 必须带明确 `where` 条件后再 `execute()`
- 如在事件中触发，注意避免再次触发同类事件形成循环

### 分页结果转换

适用：
- 实体页转 DTO 页
- 需要在分页保持元信息的前提下转换数据项

要求：
- 优先复用当前模块已有分页转换工具
- JetLinks 常见场景优先 `QueryHelper.transformPageResult(...)`

### 父子数据装配

适用：
- 分页父列表补子列表
- 树 / 分组 / 标签等一对多关系回填

要求：
- 优先 `QueryHelper.combineOneToMany(...)`
- 不在 `flatMap` 中对每个父对象逐个查询子集合
- 不自己复制分页元信息或手写易错的 `groupBy` / `collectMap`，除非当前模块已有更明确封装

### 联动同步

适用：
- 分类名回填
- 删除上游实体后清理下游记录
- 关系变化后同步冗余字段或缓存

要求：
- 能事件化就事件化
- 能批量处理就批量处理

## 何时联动到其他规则

- `createQuery()`、`QueryParamEntity`、排序、嵌套条件、分页、AssetsHolder 查询注入：继续读取 `query-dsl-rules.md`
- `createUpdate()`、`createDelete()`、`setNull(...)`、批量更新 / 删除：继续读取 `query-dsl-rules.md`
- `QueryHelper`、复杂 SQL、原生 SQL、分页结果转换、一对多组合：继续读取 `query-dsl-rules.md`
- 自定义 `termType`、动态条件、关联表 exists 查询：继续读取 `dynamic-term-rules.md`
- 跨模块能力调用：继续读取 `cross-service-call-rules.md`
- 生命周期副作用：继续读取 `event-driven-rules.md`
- 实时消息流处理：继续读取 `realtime-subscription-rules.md`

## 自检清单

- 查询方式是否沿用了当前模块现有抽象
- 复杂 SQL / 原生 SQL 是否优先评估了 QueryHelper，而不是拼接动态 SQL
- SQL 是否避免了无明确依据的数据库方言，并尽量兼容标准 SQL
- 复杂 SQL 是否按真实业务规模做了压力测试或等价性能验证
- 分页转换和一对多组合是否优先用了 QueryHelper
- 是否把副作用从 CRUD 主流程中合理拆出
- 是否避免了逐条阻塞调用
- 是否避免了无根据的原生 SQL
- 是否考虑了重复触发、循环联动和批量性能
