# JetLinks 链路追踪埋点规则

本文件用于在 JetLinks 后端代码中补充或审查链路追踪埋点。优先参考当前模块已有写法；平台统一能力来自 `org.jetlinks.core.trace.TraceHolder`、`MonoTracer`、`FluxTracer`。

## 什么时候需要手动埋点

在新增或修改关键后端业务流程时，主动判断是否需要手动 span。优先埋点：

- 用户触发的关键命令、任务、规则、场景、协议动作、批处理或状态流转。
- 跨模块调用、远程命令、外部 HTTP / RSocket / MQ、事件发布和订阅消费。
- 影响设备、产品、规则、告警、通知、文件、AI 会话等核心对象的关键阶段。
- 复杂 SQL / 查询分析 / 批量写入 / 长耗时计算 / 协议解析等排障成本高的位置。
- 需要把上游 trace 透传到 HTTP header、RSocket metadata、消息 header、RuleData header 等边界。

已有框架自动追踪的位置不要重复包一层，例如通用 HTTP filter、WebClient filter、SQL executor、RSocket command codec 已统一处理时，只在业务阶段补充 span 或属性。

## 记录什么

span 名称优先稳定、分层、低基数，例如 `/device/command/send`、`/scene/create-sql`、`/fileService/FileAnalysis/extract`。设备等领域已有 `DeviceTracer.SpanName` 时优先复用。

属性只记录排障需要的关键信息：

- 业务 ID：`deviceId`、`productId`、`ruleId`、`taskId`、`commandId`、`sessionId`。
- 业务动作：`action`、`operation`、`state`、`eventType`、`termType`。
- 规模和结果：`size`、`count`、`updated`、`matched`、`status`、`branch`。
- 查询或协议摘要：可读、脱敏、体积可控的 SQL、条件、命令、报文摘要。

不要记录：

- token、密码、密钥、完整 Authorization / Cookie、手机号、身份证、隐私字段。
- 大对象、完整 payload、完整文件内容、无限集合、未脱敏用户输入。
- 高基数原始文本作为 span 名称；这类值放入必要属性，并确认不会造成存储噪声。

计算成本高或体积可能较大的属性使用 `setAttributeLazy(...)`，并优先记录摘要而不是完整对象。

## API 选择

阻塞或同步边界：

```java
return TraceHolder.traceBlocking("/scene/create-sql", span -> {
    SqlRequest request = createSql();
    span.setAttributeLazy("sql", request::toNativeSql);
    span.setAttribute("sceneId", sceneId);
    return request;
});
```

响应式 `Mono`：

```java
return sendCommand(device, command)
    .as(MonoTracer.create(
        "/device/command/send",
        builder -> {
            builder.setAttribute("deviceId", device.getDeviceId());
            builder.setAttribute("commandId", command.getCommandId());
        }));
```

响应式 `Flux`：

```java
return notifier
    .send(templateId, context)
    .as(FluxTracer.create(
        "/notify/send",
        builder -> builder.setAttribute("templateId", templateId)));
```

上下文传播：

```java
return TraceHolder
    .writeContextTo(requestBuilder, HttpServerHeaderTraceWriter.INSTANCE)
    .then(callDownstream(requestBuilder));
```

```java
return publisher
    .contextWrite(ctx -> TraceHolder.readToContext(ctx, headers, HttpHeadersGetter.INSTANCE));
```

只有为追踪功能本身准备数据、注册监听器或避免额外追踪开销时，才用 `TraceHolder.isEnabled()` / `isDisabled()` 做条件判断；不要用它改变主业务语义。

## 位置与粒度

- 一个关键业务阶段一个 span，不要每个普通 getter、DTO 转换、循环元素、字段校验都打 span。
- 批量处理优先记录批次级 span 和 `size` / `count`，不要给每一行、每一条消息都创建高频 span，除非当前模块已有采样或按需开启机制。
- 业务分支复杂时记录分支编号、规则 ID、动作 ID、匹配结果等小而关键的属性。
- 跨线程、跨事件、跨命令、跨网络边界必须考虑 trace context 传播，不用 `ThreadLocal` 自己保存 trace。

## 交付自检

- 关键业务阶段是否有可定位的 span。
- span 名称是否稳定，属性是否包含排障必需的业务 ID、动作、结果和规模。
- 是否复用了 `TraceHolder`、`MonoTracer`、`FluxTracer` 或领域 tracer，而不是自造 tracing wrapper。
- 是否避免敏感信息、完整大 payload 和无界集合进入 trace。
- 响应式链路是否仍保持返回值、错误、取消和上下文传播语义。
