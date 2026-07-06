---
name: jetlinks-delivery
description: 为 JetLinks 代码变更准备合规交付内容。适用于需要创建符合分支策略的提交、起草或审查中文 Conventional Commit、生成 shell 可执行的 git commit 命令、遵循 JetLinks 提交标题规范、避免直推受保护分支、落实后端新增功能或行为变动的测试门禁、收集测试证据，或编写包含测试、覆盖率、代码注释 / 公共契约（含 SPI 必要 @since / @see）、TraceHolder 与 MBean 运维可观测性结论的 PR 描述的场景。
---

# JetLinks Delivery

Read [`references/git-and-pr-rules.md`](references/git-and-pr-rules.md) first.

## Workflow

1. Classify the request as commit drafting, commit review, shell commit command output, delivery preparation, or PR preparation.
2. Inspect the current branch and target base branch before staging or pushing anything.
3. Read [`references/commit-message-zh.md`](references/commit-message-zh.md) when the task involves commit wording, compliance review, or commit title selection.
4. Read [`references/shell-commit-examples.md`](references/shell-commit-examples.md) when the user wants a ready-to-run command for PowerShell, bash, zsh, or cmd.
5. Align the commit message with the repository's existing `type(scope): summary` style and clearly separate verified facts from recommended wording.
6. If the change adds backend functionality or changes existing backend behavior, ensure corresponding unit tests are added or updated before PR preparation.
7. Run the relevant unit tests and required integration tests, then collect numeric evidence.
8. Check whether the change also requires synchronizing existing owning documentation. Treat README as durable repository/module overview only; put test reports and PR evidence in PR/CI, and prefer updating an existing source document instead of creating a new task log.
9. Before creating a ready PR for backend code changes, inspect the touched code for comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md); required comments must exist in code, not only in the PR description.
10. Prepare the PR description by filling the canonical template in [`references/git-and-pr-rules.md`](references/git-and-pr-rules.md) exactly; keep headings, order, and blank lines unchanged. If the repo also has `.github/pull_request_template.md`, keep it synchronized as a mirror, but do not depend on it as the only source.

## Required Constraints

- Do not push directly to protected mainline branches unless the user explicitly overrides that rule.
- Do not say work is ready for merge without test evidence or a clearly stated blocker.
- Do not mark a backend feature or behavior-change PR as ready when corresponding unit tests or unit-test coverage data are missing.
- Do not mark a backend PR as ready when integration-test trigger conditions are met but integration-test results are missing.
- Do not say delivery is complete when code or behavior changed but required source docs are clearly stale; either update them or state the exact gap and risk.
- Do not use vague PR text such as “tested” or “optimized” without data.
- Do not default to creating a new per-task document or archive log; follow repo-local documentation rules and prefer updating existing docs.
- Do not put single-task test reports, PR descriptions, temporary plans, or troubleshooting logs into README files.
- Do not emit multi-line `git commit` commands that rely on literal `\n` becoming real newlines.
- Do not create a ready PR for backend code changes when public contracts, SPI methods, complex business branches, compatibility, permissions, lifecycle, tracing, MBean, protocol, event, or boundary logic need comments but the touched code lacks them. Fix the code comments first, or create a draft with the exact blocker.

## Response Shape

For commit-only requests:

1. Return only the final commit message by default.
2. If the user asks for review, return the review result plus the corrected message.
3. If the user asks for a command, add the shell-safe command after the message.

For full delivery requests:

1. Current delivery context or target branch strategy
2. Proposed commit message or review result
3. Shell-safe commit command
4. Backend test gate, tests, and coverage evidence
5. Documentation sync status
6. PR summary or remaining blockers
