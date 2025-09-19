#!/bin/sh
set -e

# 确保 src/modules 目录存在且有正确的权限
mkdir -p /app/src/modules
chmod 777 /app/src/modules

echo "Installing dependencies..."
# 配置 npm 源
npm config set registry ${NPM_REGISTRY:-https://registry.npmmirror.com}

find . \
  -not -path "*/node_modules*" \
  -not -path "*/api*" \
  -not -path "*/java*" \
  -not -path "*/configs*" \
  -not -path "*/docs*" \
  -not -path "*/.git*" \
  -not -path "*/dist*" \
  -not -path "*/public*" \
  -not -path "*/src/assets*" \
  -not -path "*/src/utils*" \
  -not -path "*/src/views*" \
  -not -path "*/src/layout*" \
  -not -path "*/src/hooks*" \
  -not -path "*/src/store*" \
  -not -path "*/src/components*" \
  -not -path "*/src/style*" \
  -not -path "*/src/modules/*/api*" \
  -not -path "*/src/modules/*/assets*" \
  -not -path "*/src/modules/*/utils*" \
  -not -path "*/src/modules/*/views*" \
  -not -path "*/src/modules/*/hooks*" \
  -not -path "*/src/modules/*/store*" \
  -not -path "*/src/modules/*/components*" \
  -print

# 安装 pnpm
npm install -g pnpm
# 安装项目依赖
pnpm install

# 执行原始的命令（启动开发服务器）
exec "$@"
