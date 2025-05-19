#!/bin/bash

# 初始化子模块
git submodule init
git submodule update

# 获取主仓库当前分支
main_branch=$(git symbolic-ref --short HEAD)

# 如果是dev，就使用master，否则用当前分支
if [[ "$main_branch" = "dev" || "$main_branch" = "master" ]]; then
  submodule_branch="master"
else
  submodule_branch="$main_branch"
fi

# 切换子模块到目标分支
git submodule foreach "git checkout $submodule_branch || git checkout -b $submodule_branch origin/$submodule_branch"

# 拉取子模块最新代码
git submodule foreach "git pull origin $submodule_branch"
