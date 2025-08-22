#!/bin/sh
set -e

# 确保 src/modules 目录存在且有正确的权限
mkdir -p /app/src/modules
chmod 777 /app/src/modules

echo "Installing dependencies..."
# 配置 npm 源
npm config set registry ${NPM_REGISTRY:-https://registry.npmmirror.com}
# 安装 pnpm
npm install -g pnpm
# 安装项目依赖
pnpm install

# 执行原始的命令（启动开发服务器）
exec "$@"
