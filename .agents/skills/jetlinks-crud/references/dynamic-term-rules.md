# JetLinks 动态条件与关联表条件规则

本文件用于 JetLinks 后端在实现自定义 `termType`、动态条件、关联表筛选与 QueryParam 扩展时的稳定做法。

## 何时使用

- 需要新增自定义 `termType`
- 需要让前端筛选条件映射成复杂查询语义
- 需要根据关联表是否存在记录、或关联表中的字段值来筛选主表
- 需要让同一套查询能力被多个页面或多个筛选入口复用

## 核心原则

1. 优先扩展 QueryParam 条件体系，不新增平行协议
   - 能用标准 `termType + value` 表达，就不要额外发明控制器私有查询参数。
   - 能挂到现有 `createQuery` / QueryParam / TermBuilder 链路，就不要单独绕过查询抽象。

2. 条件语义写进 `termType`，业务值写进 `value`
   - “是什么关系”放在 `termType`。
   - “筛什么值”放在 `value`。
   - 逻辑取反优先使用 `termType$not` 或现有 options 机制，不要自造一层布尔开关字段。

3. 关联查询优先抽象成可复用条件构造器
   - 如果查询本质是“主表是否满足某个关联表条件”，优先封装为通用 TermBuilder。
   - 不要把同一段 exists / join 逻辑散落在多个 service 或 controller 中。

4. 先用 DSL 表达，最后才考虑手写 SQL
   - 如果现有 `SubTableTermFragmentBuilder`、`TermFragmentBuilder`、`ConverterUtils.convertTerms` 足够表达，就不要手写专用解析器。
   - 手写 SQL 只保留在 DSL 明显无法覆盖的地方。

## 推荐模式

### 一、自定义 termType 命名

适用：
- 新增一个稳定、可复用的查询语义

要求：
- 名称优先表达“关系 / 数据来源”，不要表达某个单页临时文案。
- 如果条件本质是对子表或中间表做 exists 过滤，优先使用表语义或关系语义命名。
- 不要为了一个页面的“接入状态”“所属项目”等展示文案，重复造多个相互重叠的 `termType`。

### 二、exists / 关联表条件

适用：
- 主表要按关联表是否存在、或关联表中的字段过滤

要求：
- 优先使用 `SubTableTermFragmentBuilder` 这类“主表 -> 子表 exists”抽象。
- 如果子表默认关联列不是 `id`，再覆写对应列名；如果主子表通过主键自然关联，则不要额外绕出一层手写 join。
- 对“有任意关联记录”这类场景，允许传空对象 `{}` 作为 value，语义上表示“仅判断 exists”。

### 三、value 中的动态子条件

适用：
- 同一个关联条件需要支持继续按子表字段筛选

要求：
- `value` 优先传 map，并使用标准 QueryParam key 语义，例如：
  - `projectId$in`
  - `creatorId$eq`
  - `status$not`
- 不要为同一件事重复定义“字段名数组写法”“布尔兼容写法”“业务别名写法”多套协议，除非已存在不可去除的历史兼容负担。
- 能被 `convertTerms` 或现有 term 解析能力消费的 key，就不要自己手写 switch 解析。

### 四、前后端职责分层

适用：
- 前端显示字段与后端真实筛选字段不一致

要求：
- 前端负责把用户操作映射成标准 QueryParam 条件。
- 后端负责解释自定义 `termType` 的数据库语义。
- 不要让前端拼接数据库级 exists / join 细节。
- 不要让后端依赖页面文案级字段名来判断真实语义。

### 五、显示字段与查询字段分离

适用：
- 页面显示“项目”“创建人”“区域”等业务概念，但筛选需要落到关联表或主表 id 字段

要求：
- 允许前端用展示字段承载用户交互。
- 请求发出前，再统一映射到真实查询列和自定义 `termType`。
- 这样可以保持页面文案友好，同时避免后端为展示字段做假列适配。

### 六、兼容策略

本节只补充 `termType` / QueryParam 的专项判断；通用兼容性按 `jetlinks-router/references/backend-design-test-driven-rules.md` 的“发布边界与兼容性判断”执行，不只适用于 CRUD。

适用：
- 已有旧 `termType`、旧路由、旧已保存搜索正在被使用

要求：
- 只有在已存在历史数据或多调用方依赖时，才保留兼容 builder 或兼容值解析。
- 如果新版协议尚未对外稳定、且调用方可同步调整，优先尽快收口到单一 canonical 用法。
- 如果旧 `termType`、旧字段名或旧值结构只存在于同一个未发布 PR 的中间提交中，优先删除旧写法并统一到最佳实践，不要为了 PR 内中间形态保留兼容分支。
- 只有确认已经发布、被保存查询使用、被外部调用或被多个模块独立依赖时，才写兼容逻辑。
- 兼容逻辑必须标明过渡目的，避免长期并行两套协议。

## 反模式

- 为一个关联表 exists 判断再额外造“状态 A / 状态 B / 状态 C”多个高度重叠的 term builder
- 把取反语义塞进 `value.not=true` 等私有字段，却不复用 QueryParam 的标准选项机制
- 前端直接拼接 SQL 语义，后端只做字符串透传
- 一个页面传 `projectId`，另一个页面传 `projectId$in`，第三个页面又传 `projects`，最终都表示同一件事
- 在 service 层按 if/else 手工拆条件，而不是让 QueryParam / TermBuilder 链路统一处理

## 自检清单

- 这个需求是否真的需要新的 `termType`，还是复用现有标准条件即可
- 自定义条件是否已经落在统一 QueryParam 查询链路里
- 关联表筛选是否优先复用了 `SubTableTermFragmentBuilder` 或相邻成熟抽象
- `termType`、`value`、`$not`、`$in` 等职责是否清晰
- 是否避免了页面私有字段名直接渗透到后端数据库语义
- 是否只在确有历史负担时才保留兼容写法；PR 内未发布中间形态是否已收敛到单一最佳写法
