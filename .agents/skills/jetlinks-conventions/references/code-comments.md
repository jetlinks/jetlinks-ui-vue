# JetLinks 代码注释规范

本文件用于约束智能体在 JetLinks 后端和通用 Java 代码中写注释。目标是在三件事之间取平衡：人类能快速理解业务意图，大模型能少走弯路，代码库不被无意义注释消耗上下文。

## 基本原则

- 不能完全不写注释。代码要给人看，关键业务意图、边界和历史原因需要留在代码旁边。
- 注释解释“为什么”和“边界”，不要复述代码已经表达清楚的“是什么”。
- 注释要短而具体，优先 1 到 3 行；复杂规则优先拆成命名方法，再用注释说明业务原因。
- 类注释和 SPI 接口方法注释属于公共契约，必须完整；必要时用 `@since` / `@see` 辅助定位版本、订阅相关类型和参考实现。
- 修改代码时同步检查相邻注释是否仍准确；过期注释比没有注释更危险。
- 注释不替代清晰命名、合理拆分、测试和文档；需要长篇说明时应沉淀到设计文档或 ADR，并在代码里放短链接或编号。

## 落地门禁

- 编码前先找注释点：新增 / 修改的公共类、SPI、复杂业务分支、权限边界、兼容判断、并发 / 生命周期保护、TraceHolder 或 MBean 决策。
- 编码时把注释放到代码旁边：类上、SPI 方法上、关键分支前、边界调用前或生命周期保护处；不能只在最终回复或 PR 描述里说明。
- 编码后如果没有新增任何注释，必须能明确说明本次只改了简单赋值、DTO 搬运、直观查询或模板展示，不存在本文件列出的必须注释场景。

## 类注释

新增或修改对外可见的顶层类、接口、抽象类、枚举、配置类、实体、DTO、Command、Event、Codec、Provider、MBean、SPI 扩展点时，必须补充完整类注释。私有内部 helper 类可以按复杂度决定，但只要承载业务语义或生命周期，也要写。

类注释至少说明：

- 职责：这个类解决什么业务或技术问题。
- 边界：不负责什么，和相邻类 / 模块如何分工。
- 生命周期或调用方：由谁创建、何时调用、是否长期驻留、是否线程安全。
- 关键约束：权限、兼容、幂等、缓存、响应式 / 阻塞、TraceHolder、MBean、资源释放等。
- 契约导航：SPI、扩展点或公共 API 新增 / 变更时，按模块既有格式补 `@since`；涉及订阅、事件、Provider、Codec、Listener、默认实现或参考实现时，用 `@see` 指向最关键的相关类型。

类注释不要写提交背景、需求过程、测试记录或实现流水。

## SPI 接口方法注释

SPI、扩展点、Provider、Strategy、Codec、CommandHandler、Listener、Customizer 等由外部实现的方法，方法注释必须全面完整。实现者不能靠读某个默认实现猜契约。

SPI 方法注释至少说明：

- 调用时机：框架在什么阶段、线程 / 调度模型下调用。
- 参数语义：每个关键参数代表什么，是否可空，是否已校验，是否可修改。
- 返回语义：空值 / `Mono.empty()` / `Flux.empty()` / `false` / 异常分别代表什么。
- 副作用：是否允许写库、发事件、远程调用、修改入参、缓存结果。
- 错误处理：异常是否向上游传播，是否需要 i18nCode，是否会触发重试。
- 实现要求：幂等、顺序、并发、背压、超时、资源释放、兼容性要求。
- 契约导航：新增 / 变更的 SPI 方法按模块既有格式补 `@since`；方法依赖的订阅类、事件类、上下文、默认实现、参考实现或辅助工具，用 `@see` 指向最关键的类型。

普通业务接口如果只在模块内部使用，可以按复杂度简化；但一旦作为跨模块契约或可插拔扩展点，就按 SPI 规则写完整。

`@since` 只能填写当前模块已有约定或用户确认的真实版本；拿不准时先询问，不要编造。`@see` 用来帮助实现者快速找到相关类型，不要堆砌同包下所有实现类。

## 必须写注释的场景

- 业务规则不直观：状态机、权限例外、设备协议差异、数据口径、规则引擎分支、兼容判断。
- 代码看起来“多此一举”但有真实原因：规避框架缺陷、顺序依赖、并发保护、幂等保护、缓存失效边界、批量上限。
- 外部契约或历史兼容：已发布 API、DTO、Topic、Command、协议字段、保存查询或前端路由参数仍需兼容时。
- 安全和可观测边界：敏感字段脱敏、TraceHolder 属性选择、MBean 操作上限、数据权限过滤原因。
- 生命周期和资源管理：注册 / 注销、订阅释放、文件句柄、ByteBuf、线程池、连接池、定时任务、重试队列。
- 公共契约：类级职责、SPI 方法语义、Provider / Codec / Listener / CommandHandler 的实现约束。
- 临时方案或风险兜底：必须写明触发原因、移除条件、关联 issue / PR / 版本线。

## 不需要写注释的场景

- 简单赋值、判空、getter / setter、DTO 字段搬运、普通日志、直接调用语义清晰的方法。
- 代码命名已经清楚表达意图，例如 `filterOnlineDevices`、`assertReadPermission`、`publishDeviceOfflineEvent`。
- 为每一行解释语法、参数名或返回值。
- 把需求文档、设计过程、PR 说明、测试报告、调试记录塞进代码注释。

## 推荐写法

```java
/**
 * 设备命令下发结果处理器。
 *
 * 负责把协议侧响应转换成平台命令结果，并保留 messageId 与 trace context 的关联。
 * 不负责命令发送和重试调度，重试由上游命令网关统一处理。
 *
 * @see DeviceCommandReplySubscriber
 * @see DefaultDeviceCommandReplyHandler
 */
public interface DeviceCommandReplyHandler {
}
```

```java
/**
 * 解码协议上行报文。
 *
 * @param context 当前连接上下文，已完成基础鉴权；实现中不要长期持有。
 * @param payload 原始报文内容，可能是设备批量上报；实现必须自行处理协议内顺序。
 * @return 解码后的设备消息流；空流表示当前报文无需上报平台，异常会中断本次解码并进入网关错误处理。
 * @see DeviceMessageCodec
 * @see DeviceMessageSubscriber
 */
Flux<DeviceMessage> decode(DeviceSessionContext context, ByteBuf payload);
```

```java
// 已发布规则模板会被外部场景引用，只能新增字段，不能改写已有 termType。
query.accept(ruleTemplateTerms);
```

```java
// MBean 只允许查看有限样本，避免运维查询时把死信队列整体反序列化到内存。
int limit = Math.min(size, 1024);
```

```java
// 先写入 trace context 再投递消息，保证跨节点订阅能串起同一条业务链路。
TraceHolder.writeContextTo(ctx, payload, TopicPayload::addHeader);
```

```java
// 临时兼容 2.12 已发布字段，等保存查询迁移完成后删除。
String termType = normalizeLegacyTermType(request.getTermType());
```

## 禁止写法

```java
// 设置设备ID
entity.setDeviceId(deviceId);
```

```java
// 遍历列表
for (DeviceEntity device : devices) {
    // 添加到结果
    result.add(toView(device));
}
```

```java
// TODO: 以后优化
```

```java
// 这里很复杂，不要动
return build();
```

## 自检

- 新增或修改的对外类、接口、抽象类、枚举、Command、Event、Codec、Provider、MBean 是否有完整类注释。
- SPI / 扩展点方法是否写清调用时机、参数、返回、错误、副作用和实现约束。
- SPI 类和方法是否在必要时补了真实 `@since`，以及能帮助定位订阅相关类型、默认实现或参考实现的 `@see`。
- 本次复杂业务、兼容逻辑、并发保护、生命周期、权限、TraceHolder 或 MBean 边界是否有必要注释。
- 注释是否解释了业务原因、边界、风险或移除条件，而不是重复代码表面含义。
- 注释是否足够短，是否可以通过命名方法或变量减少注释。
- 修改后的注释是否仍与当前代码行为一致。
