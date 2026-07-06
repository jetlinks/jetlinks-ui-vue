---
name: jetlinks-capture
description: 沉淀 JetLinks 开发过程中的可复用知识。适用于任务完成后判断是否值得沉淀、先给出沉淀建议，并在用户确认后将经验整理为 worklog、knowledge、playbook、提示词或 skill 更新；若已成熟到可抽成通用 skill，则继续询问是否并入官方技能仓库 PR 的场景。
---

# JetLinks Capture

Read [`references/capture-workflow.md`](references/capture-workflow.md) first.

## Workflow

1. Judge whether the finished work is worth capturing.
2. Choose the smallest useful output form: `worklog`, `knowledge`, `playbook`, prompt update, or skill update.
3. Recommend a target path under the local `.ai/` directory before writing anything, unless the result clearly belongs in an existing owning doc or skill.
4. Present the recommendation first: whether capture is needed, why, the form/path, and the concise summary.
5. Only write the formal capture after the user confirms, unless the user already asked for direct generation.
6. If the knowledge is stable across tasks, recommend updating the related skill or prompt.
7. If the result is generic enough to become a reusable JetLinks skill, ask whether to merge it into `jetlinks-develop-skills` and prepare a PR for `https://github.com/jetlinks/jetlinks-develop-skills`.

## Required Constraints

- Do not create capture docs for every trivial change.
- Do not restate raw diffs when no reusable knowledge was learned.
- Do not use README as a place for single-task worklogs, test reports, troubleshooting notes, or PR summaries.
- Do not create a new capture document when an existing knowledge, playbook, or owning source document should be updated instead.
- Do not use capture to backfill execution logs into plan / PRD / design documents; those documents keep stable decisions, while process records stay in conversation, PR / CI evidence, workflow journals, or a user-confirmed worklog.
- Do not promote unstable one-off decisions into skills.
- Do not silently skip the recommendation when the finished task clearly produced reusable knowledge.
- Do not auto-create capture docs without user confirmation unless the user explicitly asked to generate them.
- Do not recommend an official skill PR unless the conclusion is stable across tasks and not tightly bound to one project.
- Always separate verified project facts from temporary assumptions.

## Response Shape

1. Whether capture is recommended
2. Why it is or is not worth capturing
3. Recommended output form and target path
4. The concise summary to persist
5. Whether the result should stay in `.ai/` or be promoted into a prompt / skill update
6. If it can become a common JetLinks skill, whether to merge it into `jetlinks-develop-skills` and submit a PR upstream
