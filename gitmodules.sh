#!/bin/bash
set -euo pipefail

# 子仓库已通过 Git subtree 内嵌于主仓库；本脚本从各上游仓库拉取与当前主分支对应分支的更新。

main_branch=$(git symbolic-ref --short HEAD)

if [[ "$main_branch" = "dev" || "$main_branch" = "master" ]]; then
  subtree_branch="master"
else
  subtree_branch="$main_branch"
fi

echo "同步 subtree，上游分支: $subtree_branch"

# 在 CI（GitHub Actions）中设置 GIT_SUBTREE_TOKEN，使用 HTTPS 拉取 jetlinks-v2 上游（需 PAT 可读各子仓库）
if [[ -n "${GIT_SUBTREE_TOKEN:-}" ]]; then
  _base="https://x-access-token:${GIT_SUBTREE_TOKEN}@github.com/jetlinks-v2"
  _url_core="${_base}/jetlinks-web-core.git"
  _url_auth="${_base}/authentication-manager-ui.git"
  _url_notify="${_base}/notify-manager-ui.git"
  _url_device="${_base}/device-manager-ui.git"
  _url_rule="${_base}/rule-engine-manager-ui.git"
else
  _url_core="git@github.com:jetlinks-v2/jetlinks-web-core.git"
  _url_auth="git@github.com:jetlinks-v2/authentication-manager-ui.git"
  _url_notify="git@github.com:jetlinks-v2/notify-manager-ui.git"
  _url_device="git@github.com:jetlinks-v2/device-manager-ui.git"
  _url_rule="git@github.com:jetlinks-v2/rule-engine-manager-ui.git"
fi

sync_subtree() {
  local prefix=$1
  local url=$2
  echo "---- $prefix ----"
  git subtree pull --prefix="$prefix" "$url" "$subtree_branch" --squash -m "chore: subtree pull ${prefix} (${subtree_branch})"
}

sync_subtree jetlinks-web-core "$_url_core"
sync_subtree modules/authentication-manager-ui "$_url_auth"
sync_subtree modules/notify-manager-ui "$_url_notify"
sync_subtree modules/device-manager-ui "$_url_device"
sync_subtree modules/rule-engine-manager-ui "$_url_rule"

echo "完成。"
