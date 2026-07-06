# 反传统后台感硬约束（core 入口）

硬约束拆成两片以降低单次上下文体积：

| 文件 | 体量（约） | 内容 | 何时读 |
| --- | --- | --- | --- |
| [`style-catalog-core-base.md`](style-catalog-core-base.md) | ~11KB | §1–§6：编辑梯度、首屏锚点、状态收口、密度、文案、弹窗路径 | **几乎每次**选型或实现 |
| [`style-catalog-core-detail-shell.md`](style-catalog-core-detail-shell.md) | ~12KB | §7–§8、详情页 10 条、反向引用、侧栏 / PageHead / FAB | **对象详情 / 主从 / 配置态-运行态 / 侧栏导航** |

**推荐路径**：`style-catalog-routing.md`（整篇）+ `style-catalog-core-base.md`（整篇）；仅当任务含单对象详情头、详情整页布局、侧栏或全局浮动元素时，再读 `style-catalog-core-detail-shell.md`。

**维护**：改 §1–§6 → `style-catalog-core-base.md`；改 §7+ → `style-catalog-core-detail-shell.md`。本文件只做入口表。

模版与路由分片见 [style-catalog.md](style-catalog.md)。
