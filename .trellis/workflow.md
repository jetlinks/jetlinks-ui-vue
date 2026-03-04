# 开发工作流（Trellis）

> 参考长期运行 Agent 工作流思想，并结合本项目实践整理。

---

## 目录

1. [快速开始（先做这些）](#快速开始先做这些)
2. [工作流总览](#工作流总览)
3. [会话启动流程](#会话启动流程)
4. [开发执行流程](#开发执行流程)
5. [会话结束](#会话结束)
6. [关键目录说明](#关键目录说明)
7. [最佳实践](#最佳实践)

---

## 快速开始（先做这些）

### Step 0：初始化开发者身份（首次必做）

> 支持多人协作：每位开发者 / Agent 都应先初始化自己的身份。

```bash
# 检查是否已初始化
python3 ./.trellis/scripts/get_developer.py

# 未初始化时执行
python3 ./.trellis/scripts/init_developer.py <your-name>
# 示例：python3 ./.trellis/scripts/init_developer.py sc-codex
```

初始化后会生成：

- `.trellis/.developer`：开发者身份文件（gitignore，不提交）
- `.trellis/workspace/<your-name>/`：个人工作区目录

命名建议：

- 人类开发者：`name-team`（如 `john-doe`）
- AI Agent：`<agent>-<task>`（如 `codex-user-crud`）

### Step 1：获取当前上下文

```bash
# 一次性查看完整上下文
python3 ./.trellis/scripts/get_context.py

# 或手动组合
python3 ./.trellis/scripts/get_developer.py
python3 ./.trellis/scripts/task.py list
git status && git log --oneline -10
```

### Step 2：阅读项目规范（强制）

编码前必须先读：

```bash
cat .trellis/spec/frontend/index.md
```

建议优先阅读前端规范的原因：

- 了解整体架构与模块边界
- 避免跨层改动时出现契约不一致
- 统一代码质量标准

### Step 3：按任务读取细分规范（强制）

前端任务建议至少阅读：

```bash
cat .trellis/spec/frontend/component-guidelines.md
cat .trellis/spec/frontend/hook-guidelines.md
cat .trellis/spec/frontend/state-management.md
cat .trellis/spec/frontend/type-safety.md
cat .trellis/spec/frontend/quality-guidelines.md
```

---

## 工作流总览

### 核心原则

1. **先读后写**：先理解上下文再动代码
2. **遵循规范**：先读 `.trellis/spec/*` 再实现
3. **增量开发**：一次只推进一个明确任务
4. **及时记录**：任务和会话进度及时落盘
5. **文档可维护**：单个 journal 文件不超过 2000 行

### `.trellis/` 结构概览

```text
.trellis/
├── .developer
├── scripts/
│   ├── get_context.py
│   ├── task.py
│   ├── add_session.py
│   └── ...
├── workspace/
│   ├── index.md
│   └── <developer>/
│       ├── index.md
│       └── journal-N.md
├── tasks/
│   ├── <MM-DD-task>/
│   │   ├── task.json
│   │   ├── prd.md
│   │   └── *.jsonl
│   └── archive/
└── spec/
    ├── frontend/
    └── guides/
```

---

## 会话启动流程

### 1）读取会话上下文

```bash
python3 ./.trellis/scripts/get_context.py
```

### 2）阅读相关规范

- 前端改动：先读 `spec/frontend/*`
- 跨层改动：补充读 `spec/guides/cross-layer-thinking-guide.md`

### 3）选择任务

```bash
# 查看活跃任务
python3 ./.trellis/scripts/task.py list

# 创建任务
python3 ./.trellis/scripts/task.py create "<title>" --slug <task-name>
```

---

## 开发执行流程

```text
1. 创建/选择任务
2. 编写或更新 PRD
3. 初始化任务上下文（jsonl）
4. 开始任务（set current task）
5. 实现与自测
6. 质量检查
7. 记录会话
```

### 常用命令

```bash
# 初始化上下文
python3 ./.trellis/scripts/task.py init-context <task-dir> <dev-type>

# 添加上下文文件
python3 ./.trellis/scripts/task.py add-context <task-dir> implement <path> "<reason>"
python3 ./.trellis/scripts/task.py add-context <task-dir> check <path> "<reason>"

# 激活任务
python3 ./.trellis/scripts/task.py start <task-dir>
```

### 质量检查清单（提交前）

- [ ] 相关构建通过（至少模块级构建）
- [ ] 关键功能手测通过
- [ ] 代码符合对应 `spec` 规范
- [ ] 无明显调试残留

---

## 会话结束

### 一键记录会话

```bash
python3 ./.trellis/scripts/add_session.py \
  --title "Session Title" \
  --commit "abc1234" \
  --summary "Brief summary"
```

该脚本会自动：

1. 选择当前 journal 文件
2. 必要时新建下一个 journal 文件
3. 写入本次会话内容
4. 更新索引统计

### 收尾检查

可使用 `/trellis:finish-work`，重点检查：

1. 任务完成状态与产出说明是否一致
2. lint/test/build 是否通过（按任务需要）
3. 工作区是否可交接（无不明改动）
4. 规范文档是否需要补充

---

## 关键目录说明

### `workspace/`

用途：记录个人会话过程与结果。  
更新时机：每次阶段性交付后。

### `spec/`

用途：沉淀项目实际开发规范（不是理想化模板）。  
更新时机：出现新模式、修复同类问题、形成新约定时。

### `tasks/`

用途：任务生命周期管理（需求、上下文、状态）。  
更新时机：创建新任务、切换阶段、归档任务时。

---

## 最佳实践

### 建议做（DO）

1. 每次会话先跑 `get_context.py`
2. 编码前先读相关 `spec`
3. 每次只处理一个明确问题
4. 先小范围验证，再扩大测试
5. 关键决策写入 PRD / 任务记录

### 不建议做（DON'T）

1. 跳过规范直接改代码
2. 多个无关任务混在同一次提交
3. 带着 lint/test 错误交付
4. 不记录上下文导致后续难追踪
5. AI 直接执行 `git commit`

---

## 总结

这套流程的目标是：

- 保证多会话连续性
- 提高 AI 产出与项目规范一致性
- 降低跨层改动的回归风险
- 让任务过程可追踪、可复盘

**核心理念**：先理解、后实现；按规范落地；及时记录沉淀。
