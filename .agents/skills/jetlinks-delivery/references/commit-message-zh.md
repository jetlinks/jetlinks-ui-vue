# Commit Message Zh

当任务需要起草、润色、审查中文 Conventional Commit，或需要根据实际改动选择
`type`、`scope`、`body`、`footer` 时，读取本文件。

默认只返回最终 commit message。只有在用户明确要求时，才额外解释、给出多个候选，
或由上层交付流程继续补充 shell 命令、测试证据和 PR 说明。

## Header Format

使用以下任一格式：

```text
<type>: <subject>
<type>(<scope>): <subject>
<type>!: <subject>
<type>(<scope>)!: <subject>
```

规则：

- `Header` 必填，`Body` 和 `Footer` 可选。
- `scope` 先服从仓库历史。若仓库历史通常使用 `scope`，默认不要省略；
  只有历史明确允许省略，或确实找不到合理 scope 时，才省略它。
- `subject` 使用中文，直接描述结果，不要写“处理一下”“优化代码”这类过程性表达。
- `subject` 不以句号或其他标点结尾。
- 多段 message 之间保留真实空行，不要输出 `// 空一行` 之类占位文本。

## Body And Footer

- 仅在需要说明动机、影响、迁移、取舍时添加 `Body`。
- 仅在需要引用元数据时添加 `Footer`，例如 `Refs: #123`、`Closes: #123` 或 `BREAKING CHANGE: ...`。
- 发生不兼容变更时，使用 `!` 和或 `BREAKING CHANGE:` 明确标记。
- 行宽尽量控制在 72 字以内，不超过 100 字。

## Type Selection

- `feat`: 新功能
- `fix`: 修复缺陷
- `docs`: 文档变更
- `style`: 代码格式调整，不影响运行结果
- `refactor`: 重构，不新增功能，也不修复缺陷
- `perf`: 性能优化
- `test`: 新增或调整测试
- `build`: 构建系统或依赖变更
- `ci`: CI 配置或流水线变更
- `chore`: 辅助工具、脚本或杂项维护
- `revert`: 回滚已有提交

当多个 `type` 都看起来合理时，选择最能代表主导改动的那个。若仓库历史使用更小的
允许集合，以仓库历史为准。

## Output Modes

- Draft：根据 diff、改动文件或摘要起草最合适的 message。
- Refine：保留原意，但收紧 `type`、`scope` 和中文表达。
- Review：先回答 `是否合规`，再列具体问题，最后给修正版。
- Command：如果用户要可直接执行的命令，继续读取
  [`shell-commit-examples.md`](shell-commit-examples.md)。

## Self-Check

- 输出模式与用户请求一致。
- message 为中文，除非 trailer 或固定 token 必须使用英文。
- header 格式合法，`type` 与主导改动匹配。
- `scope` 与仓库历史一致，并且有实际信息量，不是装饰字段。
- 不兼容变更已被清楚标记。
- 当用户只要 message 时，不要泄漏额外解释。
