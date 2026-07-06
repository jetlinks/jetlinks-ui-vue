# Shell Commit Examples

Use these examples only when the user explicitly wants a ready-to-run command.
If the user only wants the commit message, return the message itself instead of
wrapping it in a shell command.

## Core Rule

Do not assume `\n` inside `git commit -m "..."` will become a real newline.
In bash, zsh, PowerShell, and cmd, that often becomes literal text in the final
commit message.

For any multi-line commit message, prefer one of these patterns:

- Open the editor with `git commit`
- Pass a prepared message with `git commit -F <file>`
- Pass stdin with `git commit -F -`
- Use multiple `-m` flags only when a short header/body split is enough

## Linux And macOS

These examples work well in bash and zsh.

### Header Only

```bash
git commit -m "feat(api): 支持批量导入任务"
```

### Multi-Line Message With Here-Doc

```bash
git commit -F- <<'EOF'
feat(api): 支持批量导入任务

新增批量导入任务创建和状态查询流程，
便于前端轮询任务执行结果。

Refs: #123
EOF
```

### Short Header And Body With Repeated `-m`

```bash
git commit \
  -m "feat(api): 支持批量导入任务" \
  -m "新增批量导入任务创建和状态查询流程。

Refs: #123"
```

## Windows PowerShell

PowerShell should prefer a here-string piped into `git commit -F -`.

### Header Only

```powershell
git commit -m "feat(api): 支持批量导入任务"
```

### Multi-Line Message With Here-String

```powershell
@"
feat(api): 支持批量导入任务

新增批量导入任务创建和状态查询流程，
便于前端轮询任务执行结果。

Refs: #123
"@ | git commit -F -
```

### Important Note

- Do not use `\n` as if it were a shell newline escape in PowerShell.
- PowerShell's inline newline escape is `` `n ``, but a here-string is usually
  clearer and safer for commit messages.

## Windows CMD

CMD is awkward for multi-line inline strings. Prefer a temporary file.

### Header Only

```bat
git commit -m "feat(api): 支持批量导入任务"
```

### Multi-Line Message With Temporary File

```bat
(
echo feat(api): 支持批量导入任务
echo.
echo 新增批量导入任务创建和状态查询流程，
echo 便于前端轮询任务执行结果。
echo.
echo Refs: #123
) > commit-message.txt

git commit -F commit-message.txt
del commit-message.txt
```

## How To Choose

- Header only: use `git commit -m`.
- Header plus a short body: repeated `-m` is acceptable.
- Full multi-line message: prefer `-F -`, a here-doc, a here-string, or a file.
- Unknown shell: return the final commit message first, then ask or note that
  the exact command depends on bash/zsh, PowerShell, or cmd.

## Anti-Pattern

Avoid examples like this unless the user explicitly wants a language string
literal rather than a shell command:

```text
git commit -m "feat(skills): ...\n\n详细说明..."
```

That form is a common source of broken commit messages with literal `\n`.
