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

sync_subtree() {
  local prefix=$1
  local url=$2
  echo "---- $prefix ----"
  git subtree pull --prefix="$prefix" "$url" "$subtree_branch" --squash -m "chore: subtree pull ${prefix} (${subtree_branch})"
}

sync_subtree jetlinks-web-core git@github.com:jetlinks-v2/jetlinks-web-core.git
sync_subtree modules/authentication-manager-ui git@github.com:jetlinks-v2/authentication-manager-ui.git
sync_subtree modules/notify-manager-ui git@github.com:jetlinks-v2/notify-manager-ui.git
sync_subtree modules/device-manager-ui git@github.com:jetlinks-v2/device-manager-ui.git
sync_subtree modules/rule-engine-manager-ui git@github.com:jetlinks-v2/rule-engine-manager-ui.git

echo "完成。"
