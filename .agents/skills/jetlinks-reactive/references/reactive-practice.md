# JetLinks 响应式编程实践

本文件用于在 JetLinks 系项目中处理响应式实现细节，避免把“用了 `Mono` / `Flux`”误当成“已经是正确的响应式实现”。

## 第一原则：先确认当前模块是不是响应式

- 看控制器返回类型
- 看服务基类和仓储抽象
- 看相邻模块是否普遍使用 `Mono`、`Flux`、异步事件或异步订阅

如果当前模块是阻塞式：

- 不要为了局部新功能强行包一层响应式外壳
- 跟随现有阻塞式事务边界和调用模式

## 响应式模块的基本要求

1. 保持链路连续
   - Controller、Service、事件处理器、订阅处理器之间保持 `Mono` / `Flux` 传递。
   - 不在中间用 `block()` 回退成同步流程。

2. 不用 `subscribe()` 驱动主业务
   - 主业务控制流应留在返回链中。
   - `subscribe()` 只能用于框架托管之外、且已明确隔离的边缘场景。

3. 批处理优先于逐条处理
   - 批量更新、批量删除、消息消费、联动同步优先使用批量抽象。
   - 避免在 `flatMap` 里逐条做数据库或远程调用，形成 N 次往返。

4. 外部副作用优先后移
   - 发布消息、远程调用、缓存同步、广播通知等，优先放在事件层或提交后阶段。
   - 不把所有副作用硬塞进 CRUD 主链路。

## 官方定义与工程边界

参考官方定义：

- Reactive Streams 定义的是异步流处理与非阻塞背压协议，核心角色是 `Publisher`、`Subscriber`、`Subscription`、`Processor`。
- `Publisher` 只能在订阅后按 `Subscription.request(n)` 需求发送数据；`onError` / `onComplete` 是终止信号；`cancel` 表示下游不再需要数据。
- Reactor 的 `Mono` / `Flux` 是 `Publisher` 实现；操作符本质上是把一个 `Publisher` 组合成另一个 `Publisher` 的函数描述，实际执行发生在订阅后。
- `publishOn` / `subscribeOn` 是显式线程调度边界；`boundedElastic` 只用于无法避免的遗留阻塞调用隔离，不作为普通异步化手段。

官方来源：[Reactive Streams JVM](https://github.com/reactive-streams/reactive-streams-jvm)、[Reactor Reference Guide](https://docs.spring.io/projectreactor/reactor-core/docs/current/reference/html/)。

落到 JetLinks 代码里：

- 响应式链路从已有 `Publisher` 或第一个真实异步边界开始：响应式仓储、远程命令、事件发布、消息订阅、异步缓存等。
- 当前调用栈上的普通对象不是响应式边界。请求对象校验、DTO 转换、字段计算、条件判断先用普通函数完成。
- 每个操作符都要能说清语义：转换、筛选、异步调用、顺序组合、并发组合、错误恢复、忽略前值后的下一步、资源或背压控制。
- 如果一个 lambda 像过程式脚本，说明函数边界还没有拆出来；先按业务意图抽成命名函数，再由操作符组合。

## 常见设计准则

### 选择映射算子

- 需要保持顺序时，优先 `concatMap`
- 允许并发且当前模块已有此惯例时，使用 `flatMap`
- 只做同步映射时，使用 `map`
- `flatMap` 只用于返回 `Mono` / `Flux` 的异步步骤，不为了“看起来响应式”包一层
- 对象转换、字段计算、条件判断等没有异步边界的函数保持普通返回值，不额外封装成 `Mono` / `Flux`

### 保持算子简洁

- 不写无意义链路：`Mono.just(x).map(f)` 优先改为先计算再 `Mono.just(result)`；需要懒执行或异常进入链路时才用 `Mono.fromSupplier` / `Mono.defer`
- 当前栈上已有普通对象时，不用 `Mono.just(request).map(...).flatMap(...)` 开链；先用普通函数构造参数，再直接调用第一个响应式边界，例如 `repository.save(request.toEntity())`
- 不写 `.flatMap(Mono::just)`、`map(v -> v)`、`then(Mono.just(x))` 这类可读性更差的中转；优先 `map`、直接返回、或 `thenReturn(x)`
- 相邻 `.map(...).map(...)` 如果属于同一个同步业务步骤，合成一个按业务意图命名的普通函数；不要把校验、状态整理、字段赋值拆成一串小 `map`
- 相邻 `.filter().filter(...)` 能合并就合并；条件复杂时抽成命名谓词，避免链路被细碎条件淹没
- 必须参与成败的业务副作用不要放在 `doOnNext` / `doOnSuccess` 里，使用 `flatMap` / `then` 接入主链路
- 纯同步转换方法可在链路里用 `map(this::toView)` / `filter(this::isVisible)`，不要改成 `Mono<View> toView(...)`

### 控制集合边界

- `collectList()` 只用于明确有界的数据：分页结果、固定批次、协议天然小集合、已校验大小的入参
- 订阅流、消息流、全表查询、设备属性历史、用户可控查询等可能很大的数据，不直接 `collectList()`
- 需要聚合时优先分页、`take` / limit、定长 `buffer` / `window`、批量仓储接口、`QueryHelper.transformPageResult`、`QueryHelper.combineOneToMany` 等既有组合方式
- 判断不清数据规模时，先把数据边界写进设计稿或询问用户，不用“先收集再处理”兜底

### 控制 lambda 复杂度

- lambda 只承载局部转换、参数拼装或链路衔接
- 出现校验、查询、状态变更、副作用混在一起，或有嵌套分支、循环、`try/catch`、多次 DB / 远程调用时，抽成按业务意图命名的方法
- 抽出的私有方法按真实边界选择返回值：纯转换返回普通对象，包含 DB / 远程 / 异步副作用时才返回 `Mono` / `Flux`

### 控制链路长度

- Reactor 链不可避免，但长链必须按业务阶段拆小方法，让主链像流程目录。
- 当链路同时包含校验、权限、命令发送、持久化、日志、事件或结果转换时，优先抽成 `validateAndXxx(...)`、`saveXxxAndReturn(...)`、`publishXxxEvent(...)` 等命名步骤。
- 不把嵌套 `flatMap` 当缩进版过程式代码；嵌套里超过一个业务动作时，先抽方法。
- 拆出的响应式方法仍返回 `Mono` / `Flux`，让超时、重试、错误传播和测试仍能组合。

### 链路追踪

- 关键响应式业务阶段使用 `MonoTracer.create(...)` / `FluxTracer.create(...)` 或当前模块已有领域 tracer，不用 `doOnNext` / `doOnSuccess` 伪装成埋点。
- span 放在真实异步边界或关键业务阶段上，例如命令发送、状态流转、事件发布、批处理、外部调用、协议解析。
- trace context 跨 HTTP、RSocket、消息、事件、RuleData 等边界时，使用 `TraceHolder.readToContext(...)` / `TraceHolder.writeContextTo(...)`，不要用 `ThreadLocal` 自己传递。
- span 名称和属性、敏感信息、批量粒度等规则见 [`../jetlinks-conventions/references/tracing.md`](../jetlinks-conventions/references/tracing.md)。

### 函数式组合示例

已有普通对象时，直接调用第一个响应式边界：

```java
// Bad
return Mono.just(request)
    .map(CreateRequest::toEntity)
    .flatMap(repository::save);

// Good
return repository.save(request.toEntity());
```

链路中的纯转换用命名函数：

```java
// Bad
return repository.findById(id)
    .flatMap(entity -> Mono.just(toView(entity)));

// Good
return repository.findById(id)
    .map(this::toView);
```

异步边界用 `flatMap`，纯业务规则保持普通函数：

```java
return repository.findById(id)
    .switchIfEmpty(notFound(id))
    .map(entity -> prepareUpdate(entity, request))
    .flatMap(repository::save)
    .delayUntil(this::publishUpdatedEvent);

private DeviceEntity prepareUpdate(DeviceEntity entity, UpdateRequest request) {
    return applyUpdate(requireEnabled(entity), request);
}
```

多来源组合用组合算子表达依赖关系：

```java
return deviceService.findById(id)
    .switchIfEmpty(notFound(id))
    .flatMap(device -> permission.assertRead(device).thenReturn(device))
    .zipWhen(device -> productService.findById(device.getProductId()))
    .map(tuple -> toDetail(tuple.getT1(), tuple.getT2()));
```

可复用的链路片段用函数表达，不复制过程式 lambda：

```java
private Function<Flux<DeviceEntity>, Flux<DeviceView>> visibleDeviceViews() {
    return flux -> flux
        .filter(this::isVisible)
        .map(this::toView);
}

return repository.createQuery()
    .fetch()
    .transform(visibleDeviceViews());
```

长 Reactor 链按业务阶段拆分：

```java
// Bad
return deviceService.findById(deviceId)
    .flatMap(device -> validate(device)
        .then(sendCommand(device, command)))
    .flatMap(result -> saveLog(result).thenReturn(result));

// Good
return deviceService.findById(deviceId)
    .flatMap(device -> validateAndSendCommand(device, command))
    .flatMap(this::saveLogAndReturn);

private Mono<CommandResult> validateAndSendCommand(Device device, Command command) {
    return validate(device)
        .then(sendCommand(device, command));
}

private Mono<CommandResult> saveLogAndReturn(CommandResult result) {
    return saveLog(result)
        .thenReturn(result);
}
```

响应式关键阶段埋点：

```java
return sendCommand(device, command)
    .as(MonoTracer.create(
        "/device/command/send",
        builder -> {
            builder.setAttribute("deviceId", device.getDeviceId());
            builder.setAttribute("commandId", command.getCommandId());
        }));
```

### 错误传播

- 对用户可见异常，优先在 `Mono.error(...)` / `Flux.error(...)` 中传递带 `i18nCode` 的异常实例。
- 不要在响应式链里直接 `Mono.error(new XxxException("对象不存在"))`。
- 只有当前模块的异常模型只支持 `message` 时，才在链路边界解析本地化文案。

### 阻塞依赖的处理

- 先找当前仓库有没有同类边界的非阻塞抽象
- 如果没有，只在必要边界隔离阻塞调用
- 只有当前模块已有明确惯例时，才沿用现有 scheduler 模式
- 如果响应式链路里需要超时缓存，优先使用 `org.hswebframework.web.cache.ReactiveCache<E>`；需要本地 TTL / size 控制时，用 `com.github.benmanes.caffeine.cache.Caffeine<K, V>` 构建底层缓存，不要额外拼装临时缓存方案。

### 事件与订阅

- 事件处理器和订阅处理器优先返回 `Mono<Void>` 或当前框架惯用异步类型
- 高吞吐消息处理优先复用现有 `buffer`、`window`、批处理 sink、去重策略
- 处理器保持幂等，避免消息重放导致重复副作用

### 跨边界调用

- 调用其他模块或远程命令时，保持链式调用
- 不在响应式 consumer 里为了省事 `block`
- 参数组装尽量靠近边界，不把远程契约扩散到业务内部

### 注释边界

- 长链拆出的命名方法如果仍然承载非显而易见的异步边界、权限 / 命令 / 持久化顺序、重试 / 超时策略、取消语义、上下文传播或批量上限，需要在方法或关键分支前写短注释。
- `collectList()`、`buffer`、`window`、并发 `flatMap`、`take` / limit 等涉及数据边界或背压的地方，如果边界来自业务假设或协议限制，必须注释说明来源。
- TraceHolder / MonoTracer / FluxTracer 的 span 名称和属性选择如果看起来保守或刻意缺少 payload，需要注释说明敏感信息和基数边界。
- 直接 `map(this::toView)`、`flatMap(repository::save)`、`thenReturn(result)` 等语义清晰的链路胶水不写注释。

## 测试目标

- 用 `StepVerifier` 或项目既有测试方式验证值、完成 / 错误信号、顺序、并发、超时、重试和副作用
- 高频或批量路径验证没有 N+1 查询、无界 `collectList()`、无限并发 `flatMap` 或靠 `sleep` 等待的测试
- 对真实使用场景准备数据量：分页查询按页面规模，批处理按批次规模，订阅 / 消息流按持续输入验证背压或批量策略

## 自检清单

- 当前模块到底是响应式还是阻塞式
- 是否出现了 `block()`、嵌套 `subscribe()`、逐条低效调用
- 是否存在无意义算子、重复过滤、过大的 lambda
- 是否存在难以一眼看懂的长链；是否已按业务阶段拆成命名方法
- 关键业务阶段是否有 TraceHolder / MonoTracer / FluxTracer 埋点判断
- 是否对 `collectList()` 给出了明确的数据边界
- 是否为非显而易见的异步边界、批量 / 背压限制、重试 / 超时、生命周期清理、上下文传播补了必要代码注释
- 是否把复杂副作用合理拆到了事件层
- 是否保持了链路返回类型与相邻代码一致
- 是否对高频或批量场景做了批处理而不是逐条处理
