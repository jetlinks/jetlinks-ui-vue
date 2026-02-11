#!/bin/bash

# 配置文件路径
CONFIG_FILE="java/module_config.properties"

# 初始化变量
MODULES_TO_PACKAGE=""

# 读取配置文件
while IFS="=" read -r module_name should_package; do
  # 检查是否需要打包
  if [ "$should_package" = "true" ]; then
    # 将需要打包的模块加入列表
    if [ -z "$MODULES_TO_PACKAGE" ]; then
      MODULES_TO_PACKAGE="$module_name"
    else
      MODULES_TO_PACKAGE="$MODULES_TO_PACKAGE,$module_name"
    fi
  fi
done < "$CONFIG_FILE"

# 检查是否有模块需要打包
if [ -n "$MODULES_TO_PACKAGE" ]; then
  # 执行 Maven 打包命令
  echo "$MODULES_TO_PACKAGE"
  mvn clean deploy -pl "$MODULES_TO_PACKAGE" -am
else
  echo "没有模块需要打包"
fi
