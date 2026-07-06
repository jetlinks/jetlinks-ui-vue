# JetLinks 跨边界调用规则

本文件用于处理 JetLinks 系脚手架中的跨模块、跨服务或跨边界能力调用。

## 何时使用

- 需要查询其他业务域的数据
- 需要触发其他业务域的动作
- 需要提供对外命令服务
- 需要实现服务代理

## 第一原则：先确认当前脚手架是否已经采用命令模式

检查：

- 是否存在 `@CommandService`
- 是否存在 command support / proxy / provider
- 是否存在固定 service id、support id、command id
- 是否已存在 `QueryCommand`、`SaveCommand` 或本地自定义 command DTO / command handler

如果当前脚手架没有这套机制，不要凭空引入。

## 低上下文模板仓库模式

如果当前仓库缺少命令调用样例，按以下规则处理：

1. 默认不创建命令边界
   - 除非用户明确要求，或依赖和目录结构已经表明命令框架是脚手架内建能力。

2. 用户明确要求命令边界时
   - 只创建最小 provider / consumer 契约
   - service id、command id 使用稳定且可解释的命名
   - 在结果里明确说明这是模板仓库中的首个命令样例

3. 如果只是同仓库内的本地能力复用
   - 默认先用直接依赖或接口抽象
   - 不因为“以后可能拆服务”而提前上命令层

## Consumer 规则

1. 不臆造 service id
   - 从现有 provider 或 proxy 中确认。

2. 不在响应式链路中主动阻塞
   - 当前模块是响应式时，保持 `Mono` / `Flux` 链式调用。

3. 参数和返回值使用真实命令对象
   - 先查看现有命令类、命令处理器、DTO。
   - 优先使用显式命令对象配合 `commandSupport.execute(...)`，例如 `QueryCommand.of(...)` 或本地已定义 command DTO。
   - 不要在已有显式命令对象的场景下，退化成 `executeToMono(...)` + 零散参数、匿名 `Map` 或临时 payload。

4. 映射逻辑尽量靠近边界
   - 服务代理或 controller 中做少量装配，不把远程契约扩散到业务内部。

## Provider 规则

1. 只暴露稳定的、跨边界需要的能力
   - 不把内部实现细节直接开放出去。

2. 优先复用已有 CRUD 命令处理抽象
   - 当前工作区如果已有 CRUD command handler，跟随它。

3. 权限和资源标识跟随现有模块
   - 不要为 command 体系另起一套命名规范。

## 注释落地

- 新增或修改 command DTO、command handler、provider、proxy、跨边界 adapter 时，按公共契约补类或方法注释，说明调用方、权限上下文、参数语义、返回语义、错误传播和副作用。
- service id、command id、payload 兼容、fallback / retry、远程透明化或直接依赖的选择如果不是显而易见，需要在代码旁边写短注释。
- 仅在同模块内部直接依赖、方法命名已清楚且没有新公共契约时，可不写实现注释。

## 选择原则

### 优先命令服务

当满足以下任意条件时：

- 当前脚手架已有命令调用体系
- 调用的是另一业务边界的公开能力
- 需要路由、权限、远程透明化
- 用户明确要求建立命令边界，且当前依赖已具备相关框架

### 优先直接依赖

当满足以下条件时：

- 同一边界内的本地扩展
- 当前工作区没有命令模式
- 相邻模块本来就通过编译期依赖复用该能力

## 禁止事项

- 不要直接注入另一个边界的内部实现类，只因为它“刚好能用”
- 不要根据方法名猜 command id 或 payload 结构
- 不要在已有 `QueryCommand` / command DTO 的前提下，改用 `executeToMono(...)` 重新拼 payload
- 不要在响应式代码里为了省事 `block`
- 不要在空模板仓库里无依据地一次性创建完整 RPC 体系

## 自检清单

- service id / support id / command id 是否来自真实代码
- 是否复用了现有命令对象与 `commandSupport.execute(...)` 模式
- 调用方式是否符合当前模块编程模型
- provider 是否只暴露必要能力
- 是否避免了跨边界直接耦合实现类
- 是否为公共命令契约、权限传播、payload 兼容、fallback / retry 或边界选择补了必要代码注释
